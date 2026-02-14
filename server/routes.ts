import type { Express, Request, Response } from "express";
import { type Server } from "http";
import { submitSmileIdVerification } from "./smile-id";
import { saveVerification, updateVerificationByJobId } from "./verification-repository";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post("/api/verification/smile-id", async (req: Request, res: Response) => {
    try {
      const {
        mode = "biometric",
        userId,
        country,
        idType,
        idNumber,
        firstName,
        lastName,
        dateOfBirth,
        selfieImageBase64,
      } = req.body ?? {};

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "userId is required" });
      }

      if (mode !== "kyc" && mode !== "biometric") {
        return res
          .status(400)
          .json({ message: "mode must be either 'kyc' or 'biometric'" });
      }

      const result = await submitSmileIdVerification({
        mode,
        userId,
        country,
        idType,
        idNumber,
        firstName,
        lastName,
        dateOfBirth,
        selfieImageBase64,
      });

      await saveVerification({
        user_id: userId,
        mode,
        provider: result.provider,
        status: result.status,
        job_id: result.jobId,
        smile_job_id: result.smileJobId ?? null,
        message: result.message,
      });

      return res.status(200).json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification request failed";

      return res.status(502).json({ message });
    }
  });

  app.post("/api/verification/smile-id/callback", async (req: Request, res: Response) => {
    try {
      const payload = (req.body ?? {}) as Record<string, unknown>;

      const jobId = String(payload.job_id ?? payload.jobId ?? "");
      const status = String(payload.status ?? payload.result ?? "pending").toLowerCase();
      const message =
        typeof payload.message === "string" ? payload.message : "Smile ID callback received.";

      if (!jobId) {
        return res.status(400).json({ message: "job_id is required" });
      }

      const mappedStatus =
        status.includes("pass") || status.includes("approve")
          ? "approved"
          : status.includes("fail") || status.includes("reject")
            ? "failed"
            : "pending";

      await updateVerificationByJobId(jobId, mappedStatus, message);

      return res.status(200).json({ ok: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Callback processing failed";

      return res.status(502).json({ message });
    }
  });

  return httpServer;
}
