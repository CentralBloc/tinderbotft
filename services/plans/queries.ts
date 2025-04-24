import axios from "@/lib/axios";
import {PlansInterface} from "@/types";

/**
 * Query to get all plans
 * @returns {Promise<PlansInterface[]>} - List of plans
 */
export const getAllPlans = async (): Promise<PlansInterface[]> => {
	const response = await axios.get("/get-all-plans/").then((data) => data);
	return response.data;
};


export const getPlanById = async (id: string): Promise<PlansInterface> => {
	const response = await axios.get(`/get-plan/${id}`).then((data) => data);
	return response.data;
};

export interface createPlanCredentials {
	account_number: number;
	name: string;
	price: number;
	duration: number;
	features: string;
	billingCycle: string;
	description: string;
}

/**
 * Query to add a plan
 *  @param credentials - Plan data
 */
export const addPlan = async (credentials: createPlanCredentials) => {
	const response = await axios.post("/create-plan/", credentials);
	return response.data;
};

/**
 * Query to update a plan
 * @param id - Plan id
 * @param credentials - Plan data
 */

export const updatePlan = async (id: string, credentials: createPlanCredentials) => {
	const response = await axios.put(`/update-plan/${id}`, credentials);
	return response.data;
};

/**
 * Query to remove a plan
 * @param id - Plan id
 */
export const removePlan = async (id: string) => {
	const response = await axios.delete(`/delete-plan/${id}`);
	return response.data;
};
