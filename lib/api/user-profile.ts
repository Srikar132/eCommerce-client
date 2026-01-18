import { AddAddressRequest, Address, UpdateAddressRequest, UpdateProfileRequest, UserProfile } from "@/types";
import { apiClient } from "./client"


export const userProfileApi = {
    /**
     *  GET USER PROFIILE
     *  GET /api/v1/users/profile
     */
    getUserProfile: async () : Promise<UserProfile> => {
        const res = await apiClient.get('/api/v1/users/profile');
        return res.data;    
    },

    /**
     *  UPDATE USER PROFILE
     *  PUT /api/v1/users/profile
     */
    updateUserProfile: async (data: UpdateProfileRequest) : Promise<UserProfile> => {
        const res = await apiClient.put('/api/v1/users/profile', data);
        return res.data;
    },

    /**
     *  GET ALL USER'S ADDRESSES
     *  GET /api/v1/users/addresses
     */
    getUserAddresses: async () : Promise<Address[]> => {
        const res =  await apiClient.get('/api/v1/users/addresses');
        return res.data;
    },


    /**
     *  ADD A NEW ADDRESS
     *  POST /api/v1/users/addresses
     */
    addUserAddress: async (data: AddAddressRequest) : Promise<Address> => {
        const res = await apiClient.post('/api/v1/users/addresses', data);
        return res.data;
    },


    /**
     *  UPDATE AN ADDRESS
     *  PUT /api/v1/users/addresses/{id}
     */
    updateUserAddress: async (id: string, data: UpdateAddressRequest) : Promise<Address> => {
        const res = await apiClient.put(`/api/v1/users/addresses/${id}`, data);
        return res.data;
    },

    /**
     *  DELETE AN ADDRESS
     *  DELETE /api/v1/users/addresses/{id}
     */
    deleteUserAddress: async (id: string) : Promise<void> => {
        await apiClient.delete(`/api/v1/users/addresses/${id}`);
    }

}