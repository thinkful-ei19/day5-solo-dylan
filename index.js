const STORE = {
    items: [
        {name: 'apples', checked: false},
        {name: 'oranges', checked: false},
        {name: 'milk', checked: true},
        {name: 'bread', checked: false}
    ],
    hideCompleted: false,
    searchTerm: null
};

function handleToggleCompleted() {
    $('#toggle-completed').change(function(event) {
        $(event.currentTarget).is(':checked') ? STORE.hideCompleted = true : STORE.hideCompleted = false;
        renderShoppingList();
    });
    
}

function handleSearchList() {
    $('#js-search-form').submit(function(event) {
        event.preventDefault();
        const searchedItem = $('.js-search').val();
        // $('.js-search').val('');
        STORE.searchTerm = searchedItem;
        renderShoppingList();
    });
}

function handleToggleEditButton() {
    $('.js-shopping-list').on('click', '.js-item-edit', function(event) {
        $(event.currentTarget).parents('li').find('form').toggleClass('hidden');
    });
}

function updateItemName(newName, itemIndex) {
    STORE.items[itemIndex].name = newName;
}

function handleEditItem() {
    $('.js-shopping-list').on('submit', '.js-shopping-edit-item', function(event) {
        event.preventDefault();
        const newItemName = $(event.currentTarget).find('.js-edit-name').val();
        $('.js-edit-name').val('');
        const currentIndex = $(event.currentTarget).parent().attr('data-item-index');
        updateItemName(newItemName, currentIndex);
        renderShoppingList();
    });
}

function generateItemElement(item, itemIndex, template) {

    const hidden = (item.checked && STORE.hideCompleted) || (item.name.indexOf(STORE.searchTerm) < 0 && STORE.searchTerm) ? 'hidden' : '';

    return `
    <li class="js-item-index-element ${hidden}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <form class="js-shopping-edit-item hidden">
        <label>Edit item: </label>
        <input class="js-edit-name" name="edit" type="text">
        <button type="submit">Submit</button>
      </form>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item, index) => generateItemElement(item, index));
    return items.join('');
}


function renderShoppingList() {
    let filteredItems = [ ...STORE.items ];
    const shoppingListItemsString = generateShoppingItemsString(filteredItems);
    $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
    STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function(event) {
        event.preventDefault();
        const newItemName = $('.js-shopping-list-entry').val();
        $('.js-shopping-list-entry').val('');
        if (newItemName) {
            addItemToShoppingList(newItemName);
            renderShoppingList();
        }
    });
}

function toggleCheckedForListItem(itemIndex) {
    STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
    const itemIndexString = $(item)
        .closest('.js-item-index-element')
        .attr('data-item-index');
    return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        toggleCheckedForListItem(itemIndex);
        renderShoppingList();
    });
}

function deleteListItem(itemIndex) {
    STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        deleteListItem(itemIndex);
        renderShoppingList();
    });
}

function handleShoppingList() {
    renderShoppingList();
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleToggleCompleted();
    handleSearchList();
    handleEditItem();
    handleToggleEditButton();
}

$(handleShoppingList);