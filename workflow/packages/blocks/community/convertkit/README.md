# Notes

## Untested pieces

The following webhook trigger event types (https://developers.convertkit.com/#webhooks) have been implemented but not yet fully tested.

- subscriber.subscriber_complain

- subscriber.product_purchase

- purchase.purchase_create

<!-- If you run into problems with these events, please create an issue and tag/message me (gunther@mailcraft.co). -->

## No debounce in form fields

I have not implemented a debounce in any form fields. This means that calls to the ConvertKit API will be triggered on every keystroke for certain fields.

I have raised an issue here: https://github.com/activepieces/activepieces/issues/3142

# Building

Run `nx build blocks-convertkit` to build the library.
