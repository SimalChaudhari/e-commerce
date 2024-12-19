import { z as zod } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { Form, Field } from 'src/components/hook-form';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useDispatch } from 'react-redux';
import { sendOtp, validateOtp } from 'src/store/action/authActions';

// Validation schema for the form
const validateContact = (contact) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePattern = /^[0-9]{10}$/;

  if (emailPattern.test(contact)) {
    return true; // Valid email
  }
  if (mobilePattern.test(contact)) {
    return true; // Valid mobile number
  }
  return false; // Invalid contact
};

export const SignInSchema = zod.object({
  contact: zod
    .string()
    .min(1, { message: 'Contact is required!' })
    .refine((value) => validateContact(value), {
      message: 'Invalid email format or mobile number! Email must be valid or mobile must be 10 digits.',
    }),
  otp: zod
    .string()
    .min(1, { message: 'OTP is required!' })
    .length(6, { message: 'OTP must be exactly 6 characters!' }),
});

export function JwtSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);

  const defaultValues = {
    contact: '',
    otp: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    formState: { isSubmitting },
    watch,
    clearErrors,
    setValue, // Add setValue here
  } = methods;

  const contact = watch('contact');

  useEffect(() => {
    if (validateContact(contact)) {
      clearErrors('contact');
      setErrorMsg('');
    }
  }, [contact, clearErrors]);

  const handleSendOtp = async () => {
    const isValid = await methods.trigger('contact');
    if (isValid) {
      setIsOtpSending(true);
      try {
        const res = await dispatch(sendOtp({ contact }));
        if (res) {
          setOtpSent(true);
          setErrorMsg('');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to send OTP');
      } finally {
        setIsOtpSending(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(validateOtp(data.contact, data.otp));
      if (res) {
        router.push(PATH_AFTER_LOGIN);
      }else{
        setValue('otp', ''); // Reset only the OTP field
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to validate OTP');
    }
  };

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}> {/* Handle form submission here */}
      <Stack spacing={1.5} sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in with OTP</Typography>
      </Stack>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Stack spacing={3}>
        <Field.Text
          name="contact"
          label="Email/Mobile"
          InputLabelProps={{ shrink: true }}
          disabled={otpSent}
        />
        {!otpSent && (
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit" // Ensure this button is of type submit
            variant="contained"
            onClick={handleSendOtp}
            loading={isOtpSending}
          >
            Send OTP
          </LoadingButton>
        )}
        {otpSent && (
          <Field.Text
            name="otp"
            label="Enter OTP"
            InputLabelProps={{ shrink: true }}
          />
        )}
        {otpSent && (
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            type="submit" // Ensure this button is of type submit
            loading={isSubmitting}
            loadingIndicator="Signing in..."
          >
            Sign in
          </LoadingButton>
        )}
      </Stack>
    </Form>
  );
}
