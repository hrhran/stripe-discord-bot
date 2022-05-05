const welcomeMail = (user) => `<p class="c2"><span class="c3">Congratulations!</span></p><p class="c2 c4"><span class="c0"></span></p><p class="c2"><span class="c3">Welcome to tradewithMAK &ndash; we&rsquo;re thrilled that you have decided to join us!</span></p><p class="c2 c4"><span class="c0"></span></p><p class="c2"><span class="c9">Refer and Earn!</span></p><p class="c7"><span class="c8">This is your own referral link: </span><span class="c6"><a class="c1" href="https://dashboard.tradewithmak.com/signup?via=${user.referral_code}">https://dashboard.tradewithmak.com/signup?via=${user.referral_code}</a></span><span class="c3">&lt;link here&gt;</span></p><p class="c2 c4"><span class="c3"></span></p><p class="c2"><span class="c3">Refer others to joining tradewithMAK and earn a $10 bonus for each referral who signs up and stays with the group for at least 30 days.</span></p><p class="c2 c4"><span class="c3"></span></p><p class="c2 c4"><span class="c3"></span></p><p class="c2"><span class="c3">If you have any questions, please do not hesitate to reach out to Usama or Mike directly.</span></p><p class="c2 c4"><span class="c3"></span></p><p class="c2"><span class="c3">And, once again, welcome to tradewithMAK!</span></p><p class="c2 c4"><span class="c0"></span></p><p class="c2"><span class="c3">Thank you,</span></p><p class="c2"><span class="c8">tradewithMAK</span></p>`

const cancelMail = (user) => `
Cancel Mail Content
`

module.exports = {
    welcomeMail,
    cancelMail,
}
