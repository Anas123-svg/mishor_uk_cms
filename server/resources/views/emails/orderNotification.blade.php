<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification - Mishor</title>
    <style>
        /* General Styles */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        /* Container */
        .container {
            background-color: #fff;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .header {
            text-align: center;
            background-color: #0062cc;
            color: #fff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        /* Main Content */
        .content {
            padding: 20px;
            color: #333;
        }

        .content h2 {
            color: #0062cc;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 20px;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
        }

        /* Order Items */
        .order-items ul {
            list-style: none;
            padding: 0;
        }

        .order-items li {
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 16px;
        }

        .order-items li:last-child {
            border-bottom: none;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
            color: #666;
        }

        .footer a {
            color: #0062cc;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>New Order Received from Mishor</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
            <p><strong>Order ID:</strong> {{ $order->id }}</p>
            <p><strong>Total:</strong> ${{ $order->total }}</p>
            <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>

            <!-- Order Items -->
            <h2>Order Items</h2>
            <div class="order-items">
                <ul>
                    @foreach ($order->orderItems as $item)
                        <li>{{ $item->quantity }} x {{ $item->product->title }} - ${{ $item->product->price }}</li>
                    @endforeach
                </ul>
            </div>

            <!-- Customer Information -->
            <p><strong>Customer Name:</strong> {{ $order->name }}</p>
            <p><strong>Shipping Address:</strong> {{ $order->address }}, {{ $order->city }}, {{ $order->postalCode }}, {{ $order->country }}</p>
            <p><strong>Payment Method:</strong> {{ ucfirst($order->paymentMethod) }}</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>For more details, please <a href="https://mishor.com/admin/orders/{{ $order->id }}">log in to the admin panel</a>.</p>
            <p>&copy; {{ date('Y') }} Mishor. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
