const welcomeMail = (user) => `
Congratulations! ${user.name}

Welcome to tradewithMAK – we’re thrilled that you have decided to join us!

tradewithMAK is a great step in the right direction to take your trading to the next level. We are working hard to make tradewithMAK a one-stop shop by providing traders with access to live market commentary, educational content, and proprietary software (coming soon!).

Our primary goal is to educate our members to become self-sufficient traders. 

Please find below additional information regarding our referral program, our public and private social media content, and how to join our Discord via Launchpass.

Refer and Earn!
This is your own referral link: https://test.tradewithmak.com/signup?${user.referral_code}

Refer others to joining tradewithMAK and earn a $10 bonus for each referral who signs up and stays with the group for at least 30 days.

Find us on Social Media 
Keep yourself up to date with our latest by following us on social media:
Twitter: https://twitter.com/tradewithMAK
Instagram: https://www.instagram.com/tradewithMAK/
YouTube: https://www.youtube.com/c/tradewithMAK


Access Private Twitter Alerts
Please follow the two steps below to access our private alerts on Twitter:
Request to follow our private Twitter account: https://twitter.com/tradewithMAK2; and
Reply to the MAK-info-bot in Discord with your Twitter handle, so that we can grant you access to our private Twitter.

If you have any questions, please do not hesitate to reach out to Usama or Mike directly.

And, once again, welcome to tradewithMAK!

Thank you,
tradewithMAK

}`

const cancelMail = (user) => `
Cancel Mail Content
`

module.exports = {
    welcomeMail,
    cancelMail,
}