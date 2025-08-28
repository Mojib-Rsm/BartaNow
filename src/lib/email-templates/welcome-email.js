
export function getWelcomeEmailHtml(email) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
    const logoUrl = "https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png";
    const yearInBangla = new Intl.NumberFormat('bn-BD').format(new Date().getFullYear());

    return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>বার্তা নাও-তে স্বাগতম!</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                background-color: #f9fafb;
                color: #212529;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #212529;
                padding: 20px;
                text-align: center;
            }
            .header img {
                max-width: 150px;
            }
            .content {
                padding: 30px;
                text-align: center;
            }
            .content h1 {
                color: #007bff;
                font-size: 24px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                margin: 20px 0;
                padding: 12px 25px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
            }
            .footer {
                background-color: #e9ecef;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
            }
            .footer a {
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                 <a href="${siteUrl}"><img src="${logoUrl}" alt="BartaNow Logo"></a>
            </div>
            <div class="content">
                <h1>বার্তা নাও-এর নিউজলেটারে আপনাকে স্বাগতম!</h1>
                <p>আমাদের সাথে যুক্ত হওয়ার জন্য ধন্যবাদ। আমরা আপনাকে সর্বশেষ এবং সবচেয়ে গুরুত্বপূর্ণ খবরগুলো সরাসরি আপনার ইনবক্সে পৌঁছে দেব।</p>
                <p>আপনি এখন থেকে আমাদের সাপ্তাহিক নিউজলেটার, বিশেষ প্রতিবেদন এবং এক্সক্লুসিভ কন্টেন্ট পাবেন।</p>
                <a href="${siteUrl}" class="button">ওয়েবসাইট ভিজিট করুন</a>
            </div>
            <div class="footer">
                <p>&copy; ${yearInBangla} বার্তা নাও। সর্বসত্ত্ব সংরক্ষিত।</p>
                <p>আপনি যদি এই ইমেইলটি ভুল করে পেয়ে থাকেন, তবে এটিকে উপেক্ষা করুন।</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
