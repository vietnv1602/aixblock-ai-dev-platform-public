
import { createTrigger, TriggerStrategy } from 'workflow-blocks-framework';
import { respaidAuth } from '../../index';
import { respaidTriggersCommon } from '../common';


interface NewPaidTriggerPayload {
    unique_identifier?: string;
    name?: string;
    company_name?: string;
    email?: string;
    phone_number?: string;
    invoice_number?: string;
    amount?: number;
    currency?: string;
    payment_mode?: string | null;
    paid_at?: string;
}

export const newSuccessfulCollectionViaRespaid = createTrigger({
    name: 'new_successful_collection_via_respaid',
    displayName: 'New Successful Collection via Respaid',
    description: "Triggers when a debt is paid online via Respaid's payment link.",
    auth: respaidAuth,
    props: {},
    sampleData: {
        "unique_identifier": "123",
        "name": "John Doe",
        "company_name": "Company XYZ",
        "email": "john@example.com",
        "phone_number": "1234567890",
        "invoice_number": "INV123",
        "amount": 1000,
        "currency": "usd",
        "payment_mode": "one-shot",
        "paid_at": "2025-03-02T00:00:00+0000"
    },
    type: TriggerStrategy.WEBHOOK,
    onEnable: respaidTriggersCommon.onEnable('new_successful_collection_via_respaid'),
    onDisable: respaidTriggersCommon.onDisable('new_successful_collection_via_respaid'),
    async run(context) {
        const payload = respaidTriggersCommon.getPayload(context);
        return [payload as NewPaidTriggerPayload];
    },
})