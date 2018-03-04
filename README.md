# Bamazon

## Amazon-like storefront utilizing MySQL Node.js and Javascript skills.

### There are 2 views of the app - Customer View and Manager View.



--------------------------------------------------- **CUSTOMER VIEW:** -------------------------------------------------

This view will take in orders from customers and deplete stock from the store's inventory.

It starts with displaying the inventory in a table and prompting the user to choose item and quantity:

![Start Order](/images/start_order.png)

If the quantity ordered is bigger than what's available in the inventory then "Insufficient Quantity" Message is displayed and prompts if user want to revise the quantity or choose another item:

![Insufficient Quantity](/images/insufficient_quantity.png)

If there is enough quantity in inventory, it fills the order and calculates the total:

![Calculates](/images/calculated_order.png)

Then reduces the quantity in the table:

![Reduces quantity](/images/reduced_quantity.png)

And prompts if the user wants to place another order...
If answer is yes, it starts over. If the answer is no it exits with "Good Buy" message:

![Another order](/images/another_order.png)



--------------------------------------------------- **MANAGER VIEW:** --------------------------------------------------

This view will offer the manager to view, filter, update quantity or add new products.

It starts with displaying a set of menu options:

![Menu Options](/images/choiceOfOptions.png)

First option is displaying all products from the inventory:

![View Products](/images/view_products.png)

After each option it prompts what the manager wants to do next:

![Follow Up](/images/folowUp.png)

If manager chooses to go to the main menu it goes there, otherwise it exits:

![Exiting](/images/exiting.png)

Second option from the menu is to view low inventory or any range of quantity available that manager chooses:

![Range](/images/lowInventoryRange.png)

And then it displays the available inventory based on the parameters set up by the manager:

![Low Inventory](/images/lowInventory.png)

Third option from the menu is adding more of any item in the inventory:

![Add to Inventory](/images/updateQuantity.png)

Update is confirmed and changes displayed:

![Confirm Quantity](/images/quantityConfirm.png)

Last - forth option allows for adding a new product to the inventory
Addition is reflected in the table and displayed in the terminal:

![New Product](/images/newProduct.png)


































