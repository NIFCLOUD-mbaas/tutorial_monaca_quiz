import TestFilters from '../support/filterTests.js'

TestFilters([], () => {
    describe('ログイン - Handling Action Sign in', function () {
        var email = 'test@gmail.com'
        var pass = '123456'
        beforeEach(() => {
            cy.viewport('iphone-x')
            cy.visit('http://localhost:8080')

            // Move to login screen
            cy.get('#start_button').contains('スタートする').click()
        })

        it('ログイン screen', function () {
            cy.get('h1').contains('ログイン').should('have.text', 'ログイン')
        }) 

        it('Handling Action Sign in - Validate empty', function () {
            cy.get('#login_button').contains('ログイン').click()
            cy.get('#login_error_msg').should('have.text', 'errorCode:undefined, errorMessage:To login by account, userName and password are necessary.')
        })

        it('Handling Action Sign in - Sign in successful', function () {
            cy.get('#user_name').type(email, { delay: 100 }).should('have.value', email)
            cy.get('#password').type(pass, { delay: 100 }).should('have.value', pass)
            cy.get('#login_button').contains('ログイン').click()
            cy.wait(1000)
            cy.get('#menu_page').find('h1').contains('メニュー').should('have.text', 'メニュー')
        })
    })

    describe('または、新規登録 - Handling Action Sign up', function () {
        var email = ''
        var pass = '123456'
        beforeEach(() => {
            cy.viewport('iphone-x')
            cy.visit('http://localhost:8080')
            email = generate_random_string(8) + '@gmail.com'
            
            // Move to login screen
            cy.get('#start_button').contains('スタートする').click()
        })

        it('Handling Action Sign up - Validate empty', function () {
            cy.get('#signup_button').contains('または、新規登録').click()
            cy.get('#login_error_msg').should('have.text', 'errorCode:undefined, errorMessage:To login By Account, userName is necessary.')
        })

        it('Handling Action Sign up - Sign up successful', function () {
            cy.get('#user_name').type(email, { delay: 100 }).should('have.value', email)
            cy.get('#password').type(pass, { delay: 100 }).should('have.value', pass)
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