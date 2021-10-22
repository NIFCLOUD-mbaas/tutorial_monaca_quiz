import TestFilters from '../support/filterTests.js'

TestFilters([], () => {
    describe('ログイン - Handling Action Sign in', function () {
        var userName = 'user_test1'
        var password = '123456'
        beforeEach(() => {
            cy.viewport('iphone-x')
            cy.visit('http://localhost:8080')

            // Move to login screen
            cy.get('#start_button').contains('スタートする').click()
        })

        it('ログイン screen', function () {
            cy.wait(2000)
            cy.get('h1').contains('ログイン').should('have.text', 'ログイン')
        }) 

        it('Handling Action Sign in - Validate empty', function () {
            cy.get('#login_button').contains('ログイン').click()
            cy.get('#login_error_msg').should('have.text', 'errorCode:undefined, errorMessage:To login by account, userName and password are necessary.')
        })

        it('Handling Action Sign in - Sign in successful', function () {
            cy.get('#user_name').type(userName, { delay: 100 }).should('have.value', userName)
            cy.get('#password').type(password, { delay: 100 }).should('have.value', password)
            cy.get('#login_button').contains('ログイン').click()
            cy.wait(1000)
            cy.get('#menu_page').find('h1').contains('メニュー').should('have.text', 'メニュー')
        })
    })

    describe('または、新規登録 - Handling Action Sign up', function () {
        var userName = ''
        var password = '123456'
        beforeEach(() => {
            cy.viewport('iphone-x')
            cy.visit('http://localhost:8080')
            userName = generate_random_string(8)
            
            // Move to login screen
            cy.get('#start_button').contains('スタートする').click()
        })

        it('Handling Action Sign up - Validate empty', function () {
            cy.get('#signup_button').contains('または、新規登録').click()
            cy.get('#login_error_msg').should('have.text', 'errorCode:undefined, errorMessage:To login By Account, userName is necessary.')
        })

        it('Handling Action Sign up - Sign up successful', function () {
            cy.get('#user_name').type(userName, { delay: 100 }).should('have.value', userName)
            cy.get('#password').type(password, { delay: 100 }).should('have.value', password)
            cy.get('#signup_button').contains('または、新規登録').click()
            cy.wait(1000)
            cy.get('#menu_page').find('h1').contains('メニュー').should('have.text', 'メニュー')
        })
    })

    function generate_random_string(string_length) {
        let random_string = '';
        let random_ascii;
        for(let i = 0; i < string_length; i++) {
            random_ascii = Math.floor((Math.random() * 25) + 97);
            random_string += String.fromCharCode(random_ascii)
        }
        return random_string
    }
})