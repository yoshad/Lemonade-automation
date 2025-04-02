Feature: Homepage Functionality
  As a user
  I want to visit the homepage
  So that I can learn about available services

  @smoke
  Scenario: Verify main elements on Lemonade homepage
    Given I am on the Lemonade homepage
    Then I should see "Check our Prices" button
    # And I should see all insurance products

 @regression
  Scenario: Click 'My Account' and verify redirect to login
    Given I am on the Lemonade homepage
    When I click on the "My account" link
    Then I should be on the login page

@smoke
Scenario: Verify product links redirect correctly
  Given I am on the Lemonade homepage
  Then each product link should go to the correct page
