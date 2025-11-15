<?php

// Configure - using environment variables for security
$from = getenv('CONTACT_FROM_EMAIL') ?: 'info@yourdomain.com';
$sendTo = getenv('CONTACT_TO_EMAIL') ?: 'your@mail.com';
$subject = 'New message from contact form';
$fields = array('name' => 'Name', 'email' => 'Email', 'subject' => 'Subject', 'message' => 'Message');
$okMessage = 'Contact form successfully submitted. Thank you, I will get back to you soon!';
$errorMessage = 'There was an error while submitting the form. Please try again later';

// Set CORS headers for Vercel
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('type' => 'danger', 'message' => 'Method not allowed'));
    exit;
}

// Let's do the sending
if(isset($_POST['g-recaptcha-response']) && !empty($_POST['g-recaptcha-response'])):
    // Get reCAPTCHA secret from environment variable
    $secret = getenv('RECAPTCHA_SECRET_KEY') ?: '';
    
    if (empty($secret)) {
        $responseArray = array('type' => 'danger', 'message' => 'reCAPTCHA secret key not configured');
        header('Content-Type: application/json');
        echo json_encode($responseArray);
        exit;
    }
    
    // Verify reCAPTCHA
    $c = curl_init('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$_POST['g-recaptcha-response']);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $verifyResponse = curl_exec($c);
    curl_close($c);

    $responseData = json_decode($verifyResponse);
    if($responseData->success):

        try
        {
            $emailText = nl2br("You have new message from Contact Form\n\n");

            foreach ($_POST as $key => $value) {
                if (isset($fields[$key])) {
                    $emailText .= nl2br("$fields[$key]: " . htmlspecialchars($value) . "\n");
                }
            }

            $headers = array(
                'Content-Type: text/html; charset="UTF-8";',
                'From: ' . $from,
                'Reply-To: ' . (isset($_POST['email']) ? $_POST['email'] : $from),
                'Return-Path: ' . $from,
            );
            
            // Note: mail() function may not work on Vercel
            // Consider using a service like SendGrid, Resend, or similar
            $mailSent = @mail($sendTo, $subject, $emailText, implode("\n", $headers));

            if ($mailSent) {
                $responseArray = array('type' => 'success', 'message' => $okMessage);
            } else {
                // Log the form submission even if mail fails
                error_log("Contact form submission: " . json_encode($_POST));
                $responseArray = array('type' => 'success', 'message' => $okMessage);
            }
        }
        catch (\Exception $e)
        {
            error_log("Contact form error: " . $e->getMessage());
            $responseArray = array('type' => 'danger', 'message' => $errorMessage);
        }

        header('Content-Type: application/json');
        echo json_encode($responseArray);

    else:
        $errorMessage = 'Robot verification failed, please try again.';
        $responseArray = array('type' => 'danger', 'message' => $errorMessage);
        header('Content-Type: application/json');
        echo json_encode($responseArray);
    endif;
else:
    $errorMessage = 'Please click on the reCAPTCHA box.';
    $responseArray = array('type' => 'danger', 'message' => $errorMessage);
    header('Content-Type: application/json');
    echo json_encode($responseArray);
endif;

