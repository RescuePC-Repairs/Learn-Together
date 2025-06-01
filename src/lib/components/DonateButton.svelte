<script>
  import { onMount } from 'svelte';
  
  // Load Stripe.js asynchronously
  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  });
</script>

<div class="donate-button-container">
  <stripe-buy-button
    buy-button-id="buy_btn_1RUzcWAiBGHPVLfQmqBPccyF"
    publishable-key="pk_live_51RUysxAiBGHPVLfQG21HRfXAeKgmLBQ5lSTUkJElUJGAqv27y13i4TViaAYdqObqmWDCG7GBq5402aRYcmnneQ5d00Ih5u5yur"
  >
  </stripe-buy-button>
</div>

<style>
  .donate-button-container {
    margin: 1rem 0;
    display: inline-block;
  }
  
  /* Ensure the button is properly sized */
  stripe-buy-button {
    display: inline-block;
  }
</style>
