import TestFilters from '../support/filterTests.js'

TestFilters([], () => {
    describe('メニュー - Handling Action Click', function () {
        var email = 'test@gmail.com'
        var pass = '123456'
        var quiz_text = generate_random_string(8)
        var answer = generate_random_string(8)
        var option1 = generate_random_string(8)
        var option2 = generate_random_string(8)
        var option3 = generate_random_string(8)
        beforeEach(() => {
            cy.viewport('iphone-x')
            cy.visit('http://localhost:8080')

            // Move to login screen
            cy.get('#start_button').contains('スタートする').click()

            // Sign in successful
            cy.get('#user_name').type(email, { delay: 100 }).should('have.value', email)
            cy.get('#password').type(pass, { delay: 100 }).should('have.value', pass)
            cy.get('#login_button').contains('ログイン').click()
            cy.wait(1000)
        })

        it('メニュー screen', function () {
            cy.get('#menu_page').find('h1').contains('メニュー').should('have.text', 'メニュー')
        }) 

        it('Handling Action クイズを作る！- Create quiz', function () {
            cy.get('#create_quiz_button').contains('クイズを作る！').click()
            cy.get('h1').contains('クイズ登録画面').should('be.visible')
            cy.get('#quiz_text').type(quiz_text, { delay: 100 }).should('have.value', quiz_text)
            cy.get('#answer').type(answer, { delay: 100 }).should('have.value', answer)
            cy.get('#option1').type(option1, { delay: 100 }).should('have.value', option1)
            cy.get('#option2').type(option2, { delay: 100 }).should('have.value', option2)
            cy.get('#option3').type(option3, { delay: 100 }).should('have.value', option3)
            cy.get('span').contains('クイズを登録!').click()
            cy.wait(1000)
            cy.get('span').contains('クイズの作成が完了しました！').should('be.visible')
        })

        it('Handling Action クイズを解く！- Answer quiz', function () {
            cy.get('#answer_quiz_button').contains('クイズを解く！').click()
            cy.get('h1').contains('問題').should('be.visible')
            cy.wait(2000)
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