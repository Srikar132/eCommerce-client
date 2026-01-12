import { AddAddressRequest, Address, UpdateAddressRequest, UpdateProfileRequest, UserProfile } from "@/types";
import { apiClient } from "./client"


export const userProfileApi = {
    /**
     *  GET USER PROFIILE
     *  GET /api/v1/users/profile
     */
    getUserProfile: async () : Promise<UserProfile> => {
        return  await apiClient.get('/api/v1/users/profile');
    },

    /**
     *  UPDATE USER PROFILE
     *  PUT /api/v1/users/profile
     */
    updateUserProfile: async (data: UpdateProfileRequest) : Promise<UserProfile> => {
        return await apiClient.put('/api/v1/users/profile', data);
    },

    /**
     *  GET ALL USER'S ADDRESSES
     *  GET /api/v1/users/addresses
     */
    getUserAddresses: async () : Promise<Address[]> => {
        return  await apiClient.get('/api/v1/users/addresses');
    },


    /**
     *  ADD A NEW ADDRESS
     *  POST /api/v1/users/addresses
     */
    addUserAddress: async (data: AddAddressRequest) : Promise<Address> => {
        return  await apiClient.post('/api/v1/users/addresses', data);
    },


    /**
     *  UPDATE AN ADDRESS
     *  PUT /api/v1/users/addresses/{id}
     */
    updateUserAddress: async (id: string, data: UpdateAddressRequest) : Promise<Address> => {
        return  await apiClient.put(`/api/v1/users/addresses/${id}`, data);
    },

    /**
     *  DELETE AN ADDRESS
     *  DELETE /api/v1/users/addresses/{id}
     */
    deleteUserAddress: async (id: string) : Promise<void> => {
        return  await apiClient.delete(`/api/v1/users/addresses/${id}`);
    }

}