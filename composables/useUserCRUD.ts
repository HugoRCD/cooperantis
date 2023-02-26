import { createUserInput } from "~/server/api/user/user.dto";

export async function useSignup(createUserInput: createUserInput) {
  const { error } = await useFetch("/api/auth/signup", {
    method: "POST",
    body: createUserInput,
  });
  if (error.value) {
    useErrorToast(error.value.message);
    return;
  }
  useSuccessToast("Your account has been created");
  useRouter().push("/login");
}
