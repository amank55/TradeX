"use client"
import { Button } from "@/components/button"
import FooterLink from "@/components/forms/FooterLink"
import InputField from "@/components/forms/InputField"
import { SubmitHandler, useForm } from "react-hook-form"
import { signInWithEmail } from "@/lib/actions/auth.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
const SignIn = () => {
  const router = useRouter();
  const{
    register,
    handleSubmit,
    control,
    formState:{errors,isSubmitting}
  }=useForm<SignInFormData>({
    defaultValues:{
      email: "",
      password: ""
    }, mode: "onBlur"
  })
const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if(result.success) {
                toast.success('Signed in successfully');
                // Use setTimeout to ensure session is fully established
                setTimeout(() => {
                    router.push('/');
                }, 500);
            } else {
                toast.error('Sign in failed', {
                    description: result.error || 'Failed to sign in.'
                })
            }
        } catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to sign in.'
            })
        }
    }
  return (
    <>
    <h1 className="form-title">Welcome Back</h1>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" >
      <InputField
       name = "email"
       label="Email"
       placeholder="Enter Your Email"
       register={register}
       error={errors.email}
       validation={{ 
       required: 'Full Email is required', 
       minLength: { 
      value: 2, 
      message: 'Email must be at least 2 characters' 
      } 
     }}
    />
    <InputField 
    name="password"
    label="Password"
    placeholder="Enter Your Password"
    type="password"
    register={register}
    error={errors.password}
    validation={{ 
       required: 'Full Password is required', 
       minLength: { 
      value: 8, 
      message: 'Password must be at least 8 characters' 
      } 
     }}
    />
   <Button type = "submit" disabled= {isSubmitting}className="green-btn mt-5 w-full">
       {isSubmitting ? 'Signing In' : 'Sign In'}
   </Button>
   <FooterLink
   text="Dont have An account?"
   linkText="Sign-Up"
   href="sign-up"
   />
    </form>
    </>
  )
}
export default SignIn