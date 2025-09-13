# Email Delivery Guide

This guide explains how to ensure OTP emails are delivered to your inbox instead of the spam folder.

## Why Emails Go to Spam

1. **New Sender Reputation**: When using a new email service like SendGrid, email providers may initially filter emails as spam
2. **Content Filtering**: Certain words, formatting, or patterns can trigger spam filters
3. **Authentication**: Proper email authentication helps with deliverability
4. **User Engagement**: Email providers learn from user behavior

## How to Ensure Email Delivery

### 1. Mark as "Not Spam"
When you receive an OTP email in your spam folder:
1. Open your spam/junk folder
2. Find the email from madhukull2701@gmail.com
3. Click the "Not Spam" or "Not Junk" button

### 2. Add Sender to Contacts
Add the sender to your contacts to improve future delivery:
1. Open the email
2. Click on the sender's email address (madhukull2701@gmail.com)
3. Select "Add to Contacts" or "Save Contact"

### 3. Check Promotions Tab
Gmail sometimes places verification emails in the "Promotions" tab instead of the primary inbox.

### 4. Whitelist the Sender
In Gmail:
1. Go to Settings (gear icon)
2. See all settings
3. Filters and Blocked Addresses
4. Create a new filter for madhukull2701@gmail.com
5. Choose "Never send it to Spam"

## Best Practices for Users

1. **Act Quickly**: OTP codes expire in 15 minutes, so check your email promptly
2. **Report Issues**: If you consistently don't receive emails, contact support
3. **Use a Primary Email**: Some email providers have better deliverability than others

## For Developers

To improve email deliverability:
1. **Set up proper DNS records** (SPF, DKIM, DMARC)
2. **Use consistent sending patterns**
3. **Monitor SendGrid analytics**
4. **Maintain a good sender reputation**

## Troubleshooting

If you're still not receiving emails:

1. **Check all folders**: Primary, Promotions, Social, Updates, Forums, and Spam
2. **Try a different email address**: Test with another email provider
3. **Contact support**: If the issue persists, reach out for assistance

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Emails consistently go to spam | Mark as "Not Spam" and add to contacts |
| Delayed email delivery | Check network connectivity and SendGrid status |
| No email received | Verify email address and check all folders |
| OTP expired | Request a new OTP (max 3 times per hour) |

## SendGrid Status

You can check SendGrid's delivery status in real-time:
1. Log in to your SendGrid account
2. Navigate to "Activity Feed"
3. Search for your email address to see delivery status

The system shows "delivered" when SendGrid successfully hands off the email to the recipient's mail server.