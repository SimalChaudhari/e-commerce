
import { useForm } from 'react-hook-form';
import { Form } from 'src/components/hook-form';
import { useCheckoutContext } from './context';
import { CheckoutDelivery } from './checkout-delivery';



export function CheckoutPayment({ deliveryOptions, methods }) {
  const checkout = useCheckoutContext();


  return (
    <Form methods={methods} >
      <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={deliveryOptions} />
    </Form>
  );
}


// ----------------------------------------------------------------------

// const DELIVERY_OPTIONS = [
//   { value: 0, label: 'Transportation', description: '3-5 days delivery' },
//   { value: 20, label: 'Self Pickup', description: '2-3 days delivery' },
// ];

// export function CheckoutPayment() {
//   const checkout = useCheckoutContext();
//   const defaultValues = { delivery: checkout.shipping, payment: '' };
//   const methods = useForm({
//     defaultValues,
//   });


//   return (
//     <Form methods={methods} >
//         <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} />
//     </Form>
//   );
// }
