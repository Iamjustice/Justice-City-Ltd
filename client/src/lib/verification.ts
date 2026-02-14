import { apiRequest } from "@/lib/queryClient";

export interface VerificationRequest {
  mode: "kyc" | "biometric";
  userId: string;
  country?: string;
  idType?: string;
  idNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  selfieImageBase64?: string;
}

export interface VerificationResponse {
  provider: "smile-id" | "mock";
  status: "approved" | "pending";
  jobId: string;
  smileJobId?: string;
  message: string;
}

export async function submitVerification(
  payload: VerificationRequest,
): Promise<VerificationResponse> {
  const response = await apiRequest("POST", "/api/verification/smile-id", payload);
  return response.json();
}
