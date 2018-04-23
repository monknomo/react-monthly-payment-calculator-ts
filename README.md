Monthly Payment calculator
===========================

Setup
--------

To install, run `npm install`

To run, run `npm run start`

To build for a production deploy (which I recommend against, at this point), run `npm run build`

About
--------

This app calculates what your monthly loan payment would be, given a vehicle price, taxes and fees.  It lets you play with the apr, the loan term and your down payment, to determine what the best loan is for _you_

Design
-------

The meat of the logic is in src/MonthlyPaymentCalculator/PaymentMath.ts.  This class models a loan and calculates various properties of the loan, such as the principal and the monthly payment.  The view is src/MonthlyPaymentCalculator/MonthlyPaymentCalculator.tsx.  I attempted to make this a fairly dumb view.  I thought about abstracting out the input handling to another class, but that seemed like overkill in this context.  As it is, the inputs are fed into the PaymentMath calculator and the screen is updated as the user plays with the parameters.

I went back and forth on what the best presentation for this information is.  Since this is ultimately a coding exercise, I decided plain is ok.  I included a text masking library to assist entering dollar amounts and percentages, because I find those useful to call out to the user.
