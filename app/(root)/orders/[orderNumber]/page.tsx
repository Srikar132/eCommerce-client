'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useOrderDetails, useCancelOrder, useRequestReturn } from '@/lib/tanstack/queries/orders.queries';
import { OrderStatus, PaymentStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { 
  orderStatusStyles, 
  orderStatusLabels, 
  paymentStatusStyles, 
  paymentStatusLabels 
} from '@/lib/utils/order-utils';
import { formatCurrency, formatDate, parseCustomizationSnapshot } from '@/lib/utils';

const OrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  // Query hooks
  const { data: order, isLoading, isError, error } = useOrderDetails(orderNumber);

  console.log("Order details:", order);

  const cancelOrderMutation = useCancelOrder();
  const requestReturnMutation = useRequestReturn();


  // Dialog states
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string>('');
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);


  // Helper functions
  const canCancelOrder = (status: OrderStatus) => {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING].includes(status);
  };

  const canRequestReturn = (status: OrderStatus) => {
    return status === OrderStatus.DELIVERED;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Action handlers
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      await cancelOrderMutation.mutateAsync({
        orderNumber,
        reason: cancelReason,
      });
      toast.success('Order cancelled successfully');
      setIsCancelDialogOpen(false);
      setCancelReason('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleRequestReturn = async () => {
    if (!returnReason.trim()) {
      toast.error('Please provide a return reason');
      return;
    }

    try {
      await requestReturnMutation.mutateAsync({
        orderNumber,
        reason: returnReason,
      });
      toast.success('Return request submitted successfully');
      setIsReturnDialogOpen(false);
      setReturnReason('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to request return');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error?.message || 'The order you are looking for does not exist or you do not have access to it.'}
            </p>
            <Button onClick={() => router.push('/account/orders')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Order timeline based on status
  const getOrderTimeline = () => {
    const timeline = [
      { status: OrderStatus.PENDING, label: 'Order Placed', icon: Package },
      { status: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle2 },
      { status: OrderStatus.PROCESSING, label: 'Processing', icon: Package },
      { status: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
      { status: OrderStatus.DELIVERED, label: 'Delivered', icon: CheckCircle2 },
    ];

    // Handle cancelled/returned orders
    if (order.status === OrderStatus.CANCELLED) {
      return [
        { status: OrderStatus.PENDING, label: 'Order Placed', icon: Package },
        { status: OrderStatus.CANCELLED, label: 'Cancelled', icon: XCircle },
      ];
    }

    if ([OrderStatus.RETURN_REQUESTED, OrderStatus.RETURNED, OrderStatus.REFUNDED].includes(order.status)) {
      return [
        ...timeline,
        { status: OrderStatus.RETURN_REQUESTED, label: 'Return Requested', icon: RotateCcw },
        { status: OrderStatus.RETURNED, label: 'Returned', icon: CheckCircle2 },
      ];
    }

    return timeline;
  };

  const getCurrentStepIndex = () => {
    const timeline = getOrderTimeline();
    const statusOrder = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.RETURN_REQUESTED,
      OrderStatus.RETURNED,
    ];
    return statusOrder.indexOf(order.status);
  };

  const timeline = getOrderTimeline();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/account/orders')}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={`${orderStatusStyles[order.status]} px-4 py-2 text-sm font-medium border`}>
                {orderStatusLabels[order.status]}
              </Badge>
              <Badge className={`${paymentStatusStyles[order.paymentStatus]} px-4 py-2 text-sm font-medium border`}>
                {paymentStatusLabels[order.paymentStatus]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {timeline.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                        {/* Timeline line */}
                        {index < timeline.length - 1 && (
                          <div className="absolute left-5 top-12 h-[calc(100%-3rem)] w-0.5 bg-border" />
                        )}

                        {/* Icon */}
                        <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          isCompleted
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background border-border text-muted-foreground'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Current status
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking information */}
                {order.trackingNumber && (
                  <div className="mt-6 p-4 bg-accent rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Tracking Number
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {order.trackingNumber}
                        </p>
                        {order.carrier && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Carrier: {order.carrier}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(order.trackingNumber!, 'tracking')}
                      >
                        {copiedField === 'tracking' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Estimated delivery */}
                {order.estimatedDeliveryDate && order.status !== OrderStatus.DELIVERED && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Estimated delivery: {formatDate(order.estimatedDeliveryDate)}
                    </span>
                  </div>
                )}

                {/* Delivered date */}
                {order.deliveredAt && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      Delivered on {formatDate(order.deliveredAt)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => {
                  const customization = parseCustomizationSnapshot(item.customizationSnapshot);
                  
                  return (
                  <div key={item.id} className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b border-border">
                    {/* Product image */}
                    <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-accent group">
                      {/* Show customization preview if available, otherwise show product image */}
                      {customization?.previewUrl ? (
                        <>
                          <Image
                            src={customization.previewUrl}
                            alt={`${item.productName} - Customized`}
                            fill
                            className="object-cover"
                          />
                          {/* Preview overlay button */}
                          <button
                            onClick={() => {
                              setSelectedPreviewUrl(customization.previewUrl!);
                              setIsPreviewDialogOpen(true);
                            }}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Eye className="h-6 w-6 text-white" />
                          </button>
                        </>
                      ) : item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.productSlug}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span>Color: {item.color}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      
                      {/* Customization Details */}
                      {item.hasCustomization && customization && (
                        <div className="mt-2 space-y-1">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            Customized Design
                          </Badge>
                          {customization.threadColor && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Thread Color:</span>
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full border border-border" 
                                  style={{ backgroundColor: customization.threadColor }}
                                />
                                <span className="font-mono">{customization.threadColor}</span>
                              </div>
                            </div>
                          )}
                          {customization.additionalNotes && (
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Note:</span> {customization.additionalNotes}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Production Status */}
                      <div className="mt-2">
                        <Badge 
                          variant="outline"
                          className={
                            item.productionStatus === 'COMPLETED'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : item.productionStatus === 'IN_PROGRESS'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {item.productionStatus === 'COMPLETED' && 'Ready'}
                          {item.productionStatus === 'IN_PROGRESS' && 'In Production'}
                          {item.productionStatus === 'PENDING' && 'Pending'}
                        </Badge>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                )})}
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">{formatCurrency(order.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{formatCurrency(order.shippingCost)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">{order.shippingAddress.addressType}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.streetAddress}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                </CardContent>
              </Card>
            )}

            {/* Billing Address */}
            {order.billingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">{order.billingAddress.addressType}</p>
                  <p className="text-muted-foreground">{order.billingAddress.streetAddress}</p>
                  <p className="text-muted-foreground">
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{order.billingAddress.country}</p>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            {order.razorpayOrderId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Payment ID</p>
                    <p className="font-mono text-xs break-all">{order.razorpayOrderId}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {canCancelOrder(order.status) && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setIsCancelDialogOpen(true)}
                  disabled={cancelOrderMutation.isPending}
                >
                  {cancelOrderMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Cancel Order
                </Button>
              )}

              {canRequestReturn(order.status) && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsReturnDialogOpen(true)}
                  disabled={requestReturnMutation.isPending}
                >
                  {requestReturnMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4 mr-2" />
                  )}
                  Request Return
                </Button>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">
                  Need Help?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Cancellation Reason *</Label>
              <Textarea
                id="cancelReason"
                placeholder="Please tell us why you're cancelling this order..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelDialogOpen(false);
                setCancelReason('');
              }}
              disabled={cancelOrderMutation.isPending}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending || !cancelReason.trim()}
            >
              {cancelOrderMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Order'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Order Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Return</DialogTitle>
            <DialogDescription>
              Please provide a reason for returning this order. Our team will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="returnReason">Return Reason *</Label>
              <Textarea
                id="returnReason"
                placeholder="Please tell us why you're returning this order..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReturnDialogOpen(false);
                setReturnReason('');
              }}
              disabled={requestReturnMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestReturn}
              disabled={requestReturnMutation.isPending || !returnReason.trim()}
            >
              {requestReturnMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customization Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customization Preview</DialogTitle>
            <DialogDescription>
              Your customized design preview
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full aspect-3/4 bg-muted rounded-lg overflow-hidden">
            {selectedPreviewUrl && (
              <Image
                src={selectedPreviewUrl}
                alt="Customization Preview"
                fill
                className="object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                window.open(selectedPreviewUrl, '_blank');
              }}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Full Size
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrapper component with Suspense
export default function OrderPageWrapper() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    }>
      <OrderPage />
    </Suspense>
  );
}