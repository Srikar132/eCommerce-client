import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, deleteImage, extractPublicId, isCloudinaryConfigured } from '@/lib/cloudinary';
import { auth } from '@/auth';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
];

export async function POST(request: NextRequest) {
    try {
        // Check Cloudinary configuration
        if (!isCloudinaryConfigured()) {
            console.error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
            return NextResponse.json(
                { error: 'Image upload service is not configured. Please contact administrator.' },
                { status: 503 }
            );
        }

        // Check authentication
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        const uploadResults = [];
        const errors = [];

        for (const file of files) {
            // Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push({
                    file: file.name,
                    error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`,
                });
                continue;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                errors.push({
                    file: file.name,
                    error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
                });
                continue;
            }

            try {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                console.log(`Uploading file: ${file.name}, size: ${buffer.length} bytes`);

                const result = await uploadImage(buffer, {
                    folder: 'nala-armoire/products',
                });

                console.log(`Upload successful: ${result.secure_url}`);

                uploadResults.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    size: result.bytes,
                    originalName: file.name,
                });
            } catch (uploadError) {
                const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
                console.error('Upload error for file:', file.name, errorMessage, uploadError);
                errors.push({
                    file: file.name,
                    error: `Failed to upload: ${errorMessage}`,
                });
            }
        }

        return NextResponse.json({
            success: true,
            uploaded: uploadResults,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE endpoint to remove images from Cloudinary
export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');
        const publicId = searchParams.get('publicId');

        const targetPublicId = publicId || (imageUrl ? extractPublicId(imageUrl) : null);

        if (!targetPublicId) {
            return NextResponse.json(
                { error: 'No image URL or public ID provided' },
                { status: 400 }
            );
        }

        await deleteImage(targetPublicId);

        return NextResponse.json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        console.error('Delete API error:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
