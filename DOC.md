# BC-USDT Payment Component

The USDT Payment Component is a React-based solution for integrating cryptocurrency payments into your e-commerce platform or application. It allows customers to pay using USDT (Tether) on the Polygon network, with automatic currency conversion from various fiat currencies.

![USDT Payment Component Screenshot](https://i.ibb.co/qBbtS6S/Screenshot-2024-09-27-at-05-38-57.png)

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Props](#props)
4. [Styling](#styling)
5. [Currency Conversion](#currency-conversion)
6. [Account Creation](#account-creation)
7. [Payment Flow](#payment-flow)
8. [Customization](#customization)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

## Installation

To install the USDT Payment Component, run the following command in your project directory:

```bash
npm install bc-usdt-payment
```

## Usage

Here's a basic example of how to use the USDT Payment Component in your React application:

```jsx
import React from "react";
import USDTPayment from "bc-usdt-payment";

const CheckoutPage = () => {
  return (
    <USDTPayment
      storeId="your-store-id"
      amount={100}
      currency="USD"
      description="Premium Subscription - 1 Year"
      callbackUrl="https://your-store.com/payment-complete"
      onSuccess={(transactionId) =>
        console.log("Payment successful:", transactionId)
      }
    />
  );
};

export default CheckoutPage;
```

## Props

The USDTPayment component accepts the following props:

| Prop        | Type     | Required | Description                                                            |
| ----------- | -------- | -------- | ---------------------------------------------------------------------- |
| storeId     | string   | Yes      | Your unique store identifier                                           |
| amount      | number   | Yes      | The payment amount in the specified currency                           |
| currency    | string   | Yes      | The currency code (e.g., "USD", "EUR", "ZAR")                          |
| description | string   | Yes      | A brief description of the purchase                                    |
| callbackUrl | string   | Yes      | The URL to redirect after successful payment                           |
| onSuccess   | function | No       | Callback function called with the transaction ID on successful payment |

## Styling

The component uses Tailwind CSS classes for styling. If you're not using Tailwind in your project, you'll need to include the Tailwind CSS file or provide equivalent styles.

To customize the appearance, you can override the Tailwind classes or provide your own CSS.

## Currency Conversion

The component automatically converts the specified currency to USDT using the CoinGecko API. This conversion happens in real-time when the component mounts or when the amount or currency props change.

## Account Creation

The payment flow includes an optional account creation step for BananaCrystal. This allows users to access additional features like P2P transfers and debit card access.

## Payment Flow

1. User enters their details (name and email)
2. Component fetches the USDT equivalent of the payment amount
3. User is presented with the USDT wallet address for payment
4. User sends USDT to the provided address
5. User enters the transaction hash
6. Component verifies the payment
7. On success, user is redirected to the specified callback URL

![Payment Flow Diagram](https://i.ibb.co/7bSNKkr/Screenshot-2024-09-27-at-05-52-06.png)

## Customization

You can customize various aspects of the component by modifying the source code. Key areas for customization include:

- Text and labels
- Color scheme (by modifying Tailwind classes)
- Layout of information displayed
- Additional fields or steps in the payment process

## Error Handling

The component includes built-in error handling for common scenarios such as:

- Failed currency conversion
- Network errors
- Invalid input

Errors are displayed to the user using the Alert component. You can customize error messages by modifying the relevant sections in the code.

## Best Practices

1. Always use HTTPS in production to secure user data
2. Regularly update the component to ensure you have the latest security patches
3. Implement server-side validation for all payments
4. Provide clear instructions to users about the USDT payment process
5. Ensure compliance with local regulations regarding cryptocurrency payments

## Support

For any issues or feature requests, please open an issue on the GitHub repository: [https://github.com]

---

Thank you for using the BananaCrystal USDT Payment Component! We hope this tool helps streamline your cryptocurrency payment process.
