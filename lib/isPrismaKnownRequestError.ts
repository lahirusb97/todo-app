import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const isPrismaKnownRequestError = (
  error: unknown
): error is PrismaClientKnownRequestError => {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as PrismaClientKnownRequestError).code === "string"
  );
};

export default isPrismaKnownRequestError;
