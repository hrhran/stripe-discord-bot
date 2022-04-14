const welcomeMail = (user) => `
<p>Congratulations! ${user.name}</p><br>
<p>Welcome to tradewithMAK &ndash; we&rsquo;re thrilled that you have decided to join us!</p><br>
<p>tradewithMAK&nbsp;is a great step in the right direction to take your trading to the next level. We are working hard to make tradewithMAK a one-stop shop by providing traders with access to live market commentary, educational content, and proprietary software (coming soon!).</p><br>
<p>Our primary goal is to educate our members to become self-sufficient traders.&nbsp;</p><br>
<p>Please find below additional information regarding our referral program, our public and private social media content, and how to join our Discord via Launchpass.</p><br>
<p>Refer and Earn!</p>
<p>This is your own referral link: https://test.tradewithmak.com/signup?via=${user.referral_code}</p><br>
<p>Refer others to joining tradewithMAK and earn a $10 bonus for each referral who signs up and stays with the group for at least 30 days.</p>
<br>
<p>Find us on Social Media&nbsp;</p>
<p>Keep yourself up to date with our latest by following us on social media:</p>
<ul>
    <li>
        <p>Twitter:&nbsp;<a href="https://twitter.com/tradewithMAK">https://twitter.com/tradewithMAK</a></p>
    </li>
    <li>
        <p>Instagram:&nbsp;<a href="https://www.instagram.com/tradewithmak/">https://www.instagram.com/tradewithMAK/</a></p>
    </li>
    <li>
        <p>YouTube:&nbsp;<a href="https://www.youtube.com/c/tradewithmak">https://www.youtube.com/c/tradewithMAK</a></p>
    </li>
</ul>
<br>
<p>Access Private Twitter Alerts</p>
<p>Please follow the two steps below to access our private alerts on Twitter:</p>
<ol>
    <li>
        <p>Request to follow our private Twitter account:&nbsp;<a href="https://twitter.com/tradewithMAK2">https://twitter.com/tradewithMAK2</a>; and</p>
    </li>
    <li>
        <p>Reply to the MAK-info-bot in Discord with your Twitter handle, so that we can grant you access to our private Twitter.</p>
    </li>
</ol><br>
<p>If you have any questions, please do not hesitate to reach out to Usama or Mike directly.</p><br>
<p>And, once again, welcome to tradewithMAK!</p>
<br>
<p>Thank you,</p>
<p>tradewithMAK</p>`

const cancelMail = (user) => `
Cancel Mail Content
`

module.exports = {
    welcomeMail,
    cancelMail,
}