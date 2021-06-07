import TestFilters from '../support/filterTests.js'

TestFilters([], () => {
    describe('Test home screen', function () {
        beforeEach(() => {
            cy.viewport('iphone-x')
            cy.visit('http://localhost:8080')
          })
    
        it('Handling Home screen', function () {
            cy.get('#home_page').find('h1').contains('クイズアプリ').should('have.text', 'クイズアプリ')
            cy.get('#home_page').find('p').contains('created by mobile backend team.').should('have.text', 'created by mobile backend team.')
            cy.get('#start_button').contains('スタートする').click()
        })
    })
})