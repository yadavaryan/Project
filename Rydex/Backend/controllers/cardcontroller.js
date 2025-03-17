import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QhUo74FHz8fCvAZ97seXgUedsgiV8A7ASzxFzY57XKj4TnKjrnw9sVteGCNxe3XTXoXuIG9Y3FFacIGKP0wqwFz00ZqQgm2Ra');

export const addcard = async (req,res) => {
    try {
        
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                token: req.body.token, 
            },
        });
        

        const paymentMethodAttach = await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: req.body.customer_id,
        });
        
        await stripe.customers.update(req.body.customer_id, {
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
        });

        res.json();

    } catch (error) {
        res.status(500).json({ error: 'Error saving card' });
    }
 }

 export const getcustomercards = async (req, res) => {
    try {
        const customerId  = req.params.id;  
        
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });
        const customer = await stripe.customers.retrieve(customerId);
        const defaultid = customer.invoice_settings.default_payment_method;
        
        const cards = paymentMethods.data.map((card) => {
            if(card.id === defaultid){
                card.isDefault = true;
            }
        })
        

        res.json({ paymentMethods });
    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const setdefaultcard = async (req, res) => {
    
    try {
        const { customer_id, paymentmethodid } = req.body;
        

        await stripe.customers.update(customer_id, {
            invoice_settings: {
                default_payment_method: paymentmethodid,
            },
        });

        const customer = await stripe.customers.retrieve(customer_id);
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
