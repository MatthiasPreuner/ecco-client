describe('LoginPage', () => {
  it('loginTest', () => {
    //Anmelden
    cy.visit('/');
    cy.get('#formBasicEmail', { timeout: 90000 }).type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();

    //Abmelden
    cy.get(':nth-child(2) > .nav-item > #basic-nav-dropdown').click();
    cy.get('.dropdown-item').click();
  })
});


describe('RepositoriesPage', () => {
  it('reachabilityPageTest', () => {
    //Anmelden
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.get('.my-4 > :nth-child(1)').click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();

    //Test
    cy.get('.my-4 > :nth-child(1)').click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    cy.wait(1000);
    cy.get('[href="/variants"]').click();
    cy.get('.me-auto > .nav-item > #basic-nav-dropdown').click();
    cy.get('[href="/repositories"]').click();
    cy.get('[data-bs-target=".navbar-collapse.show"]').click();

    //Abmelden
    cy.get(':nth-child(2) > .nav-item > #basic-nav-dropdown').click();
    cy.get(':nth-child(2) > .nav-item > .dropdown-menu > .dropdown-item').click();
  })

  it('cloneRepositoryTest', () => {
    //Anmelden
    cy.visit('/');;
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select Repo
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    
    //clone
    cy.get('.mb-5 > :nth-child(2) > .w-100').click();
    cy.get('.d-flex > .btn-secondary').click();
    cy.get('.mb-5 > :nth-child(2) > .w-100').click();
    cy.get('.modal-body > .mb-3 > .form-control').type('cloneTestRepo');
    cy.get('.d-flex > .btn-primary').click();
    cy.wait(10000);
    cy.contains('cloneTestRepo').click();
    cy.get(':nth-child(2) > :nth-child(1) > .btn').click();
  })

  it('checkCloneTest', () => {
    //Anmelden
    cy.visit('/');;
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
    
    //select Repo
    cy.contains("cloneTestRepo").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
  
    cy.get('[data-bs-target=".navbar-collapse.show"]').click();
    cy.contains('WEATHER').click();
    cy.contains('RSS').click();
    cy.contains('SETTINGS').click();
    cy.contains('BASE').click();
    cy.contains('I18N').click();
    cy.contains('TRAFFIC').click();
  })

  //TBE Fork is not fully supported by Eccos Core yet
  /*
  it('forkRepositoryTest_Text', () => {
    //Anmelden
    cy.visit(HTTP_PATH);
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
    //select Repo
    cy.contains('BigHistory_full').click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    
    //fork Repo
    cy.get(':nth-child(3) > .w-100').click();
    cy.get('.d-flex > .btn-secondary').click();
    cy.get(':nth-child(3) > .w-100').click();
    cy.get('.modal-body > :nth-child(1) > .form-control').type('textForkRepo');
    cy.contains('RSS').click();
    cy.contains('SETTINGS').click();
    //cy.contains('BASE').click();
    //cy.contains('I18N').click();
    cy.contains('TRAFFIC').click();
    //check if Configuration is right
    cy.contains('WEATHER.10');
    //cy.contains('BASE');
    cy.get('.d-flex > .btn-primary').click();
    cy.contains('textForkRepo').click();
    cy.get(':nth-child(2) > :nth-child(1) > .btn').click();
  })

  it('checkForkTest_Text', () => {
    //Anmelden
    cy.visit(HTTP_PATH);
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
    //select Repo
    cy.contains('textForkRepo').click();
    cy.get(':nth-child(2) > :nth-child(1) > .btn').click();
    cy.get('[data-bs-target=".navbar-collapse.show"]').click();
    cy.contains('WEATHER').click();
  })
  */

  it('forkRepositoryTest_Image', () => {
    //Anmelden
    cy.visit('/');;
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
    //select Repo
    cy.contains('ImageVariants').click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    
    //forkRepo
    cy.get(':nth-child(3) > .w-100').click();
    cy.get('.d-flex > .btn-secondary').click();
    cy.get(':nth-child(3) > .w-100').click();
    cy.get('.modal-body > :nth-child(1) > .form-control').type('imageForkRepo');
    cy.contains('stripedshirt').click();
    cy.contains('glasses').click();
    cy.contains('jacket').click();
    cy.contains('purpleshirt').click();
    cy.contains('hat').click();
    //check if Configuration is right
    cy.contains('person.1');
    cy.get('.d-flex > .btn-primary').click();
    cy.wait(10000);
    cy.contains('imageForkRepo').click();
    cy.get(':nth-child(2) > :nth-child(1) > .btn').click();
  })

  it('checkForkTest_Image', () => {
    //Anmelden
    cy.visit('/');;
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
    //select Repo
    cy.contains('imageForkRepo').click();
    cy.get(':nth-child(2) > :nth-child(1) > .btn').click();

    //check Data
    cy.get('[data-bs-target=".navbar-collapse.show"]').click();
    cy.contains('person').click();
  })


  it('filterRepositoryTest', () => {
    //Anmelden
    cy.visit('/');;
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
   
    cy.get('.form-control').type('B');
    cy.contains('BigHistory_full').click();

    cy.get('.form-control').clear();
    cy.get('.form-control').type('Im');
    cy.contains('ImageVariants').click();
  })
  
  it('createRepositoryTest', () => {
    //Anmelden
    cy.visit('/');;
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
   
    cy.get('.mb-5 > :nth-child(1) > .btn').click();
    cy.get('.d-flex > .btn-secondary').click();
    cy.get('.mb-5 > :nth-child(1) > .btn').click();
    cy.get('.modal-body > .mb-3 > .form-control').type('newTestRepo');
    cy.get('.d-flex > .btn-primary').click();
    cy.contains('newTestRepo').click();
    cy.get(':nth-child(2) > :nth-child(1) > .btn').click();
  })

  it('deleteRepositoryTest', () => {
    //Anmelden
    cy.visit('/');;
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
   
    //delete newTestRepo
    cy.contains("newTestRepo").click();
    cy.get(':nth-child(4) > .btn').click();
    cy.get('.modal-footer > .btn-secondary').click();
    cy.get(':nth-child(4) > .btn').click();
    cy.get('#formBasicEmail').type('DELETE');
    cy.get('.modal-footer > .btn-primary').click();

    //delete cloneTestRepo
    cy.contains("cloneTestRepo").click();
    cy.get(':nth-child(4) > .btn').click();
    cy.get('#formBasicEmail').type('DELETE');
    cy.get('.modal-footer > .btn-primary').click();

     //delete image-forkTestRepo
     cy.contains("imageForkRepo").click();
     cy.get(':nth-child(4) > .btn').click();
     cy.get('#formBasicEmail').type('DELETE');
     cy.get('.modal-footer > .btn-primary').click();
  })
});

describe('FeaturePage', () => {
    it('filterFeatureTest', () => {
      //Anmelden
      cy.visit('/');;
      cy.get('#formBasicEmail').type('Tobias');
      cy.get('#formBasicPassword').type('admin');
      cy.contains('Sign').click();
      cy.wait(1000);
  
      //select Repo
      cy.contains("BigHistory_full").click();
      cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
  
      cy.get('[data-bs-target=".navbar-collapse.show"]').click();
      cy.get('.mb-3 > .form-control').type('W');
      cy.contains('WEATHER').click();
      
      cy.get('.mb-3 > .form-control').clear();
      cy.get('.mb-3 > .form-control').type('s');
      cy.contains('RSS').click();
  
    })
  
    it('featureSettingTest', () => {
      //Anmelden
      cy.visit('/');;
      cy.get('#formBasicEmail').type('Tobias');
      cy.get('#formBasicPassword').type('admin');
      cy.contains('Sign').click();;
      cy.wait(1000);
      //select Repo
      cy.contains("BigHistory_full").click();
      cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
  
      cy.get('[data-bs-target=".navbar-collapse.show"]').click();
      cy.contains('RSS').click();
      //Description
      cy.get('#RSS').type("test description");
      cy.get(':nth-child(3) > .btn-secondary').click();
      cy.get('#RSS').type("test description");
      cy.get(':nth-child(3) > .btn-primary').click();
    
      //Description Feature
      cy.get("#\\33 ").type('test description');
      cy.get(':nth-child(6) > .btn-secondary').click();
      cy.get('#\\33 ').type('test description');
      cy.get(':nth-child(6) > .btn-primary').click();
   })
  
    it('pullFeatures', () => {
      //Anmelden
      cy.visit('/');
      cy.get('#formBasicEmail').type('Tobias');
      cy.get('#formBasicPassword').type('admin');
      cy.contains('Sign').click();
      cy.wait(1000);
      //select Repo
      cy.contains("BigHistory_full").click();
      cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
  
      //click Feature
      cy.get('[data-bs-target=".navbar-collapse.show"]').click();
        
      //button pull feature
      cy.contains('Pull Feature').click();
      // select imageRepo
      cy.wait(1000);
      cy.get('#selectRepo').select(0);
      cy.get('#selectRepo').select('ImageVariants');
      cy.wait(5000);
      cy.contains('person').click();
      cy.get('.modal-footer > .btn-primary');
  
      //get feature person
      cy.contains('person').click();
   })
  });

  
describe('CommitsPage', () => {
 
  it('newCommitTextTest', () => {
    //log in 
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select repository
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    cy.get('[href="/commits"]').click();
    cy.get(':nth-child(2) > .w-100').click();
    //close
    cy.get('.d-flex > .btn-secondary').click();
    cy.get(':nth-child(2) > .w-100').click();
  
    //upload of folder not possible
 })

  it('newCommitImageTest', () => {
    //Anmelden
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select Repo
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
  })

  //DONE
  it('compareCommitsTest', () => {
    //Anmelden
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select Repo
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();

    //go to Commits
    cy.get('[href="/commits"]').click();
    
    //crtl
    cy.get('tbody > :nth-child(1) > [style="min-width: 70%;"]').click({
      ctrlKey: true,
    })

    cy.get(':nth-child(2) > [style="min-width: 70%;"]').click({
      ctrlKey: true,
    })
    //compare
    cy.get('.d-inline-block > .w-100').click();

    //close
    cy.get('.d-flex > .btn').click();
  })
});


describe('VariantsPage', () => {
  
  it('createRemoveVariant', () => {
    //login
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);
    //select Repo
    cy.contains("ImageVariants").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    //go to Variants
    cy.get('[href="/variants"]').click();
    cy.get(':nth-child(1) > .w-100').click();
    cy.get('.d-flex > .btn-secondary').click();
    cy.get(':nth-child(1) > .w-100').click();
    cy.get('.modal-body > :nth-child(1) > .form-control').type('testVariant');
    cy.get(':nth-child(2) > .form-control').type('testDescription');
    //person add
    cy.get('#\\32 ').click();
    //jacket add
    cy.get('#\\33 ').click();
    cy.get('.d-flex > .btn-primary').click();
    //get testVariant
    cy.contains('testDescription').click();
    //check features
    cy.contains('jacket');
    cy.contains('person');

    cy.contains('testDescription').click();
    //delete Features
    cy.get(':nth-child(1) > .float-end > :nth-child(2) > .bi').click();
    cy.get(':nth-child(2) > .float-end > :nth-child(2) > .bi').click();
    //add feature 
    cy.get('.mr-auto > .row > .col').click();
    cy.get('.dropdown > .dropdown-menu > :nth-child(2)').click();
    //remove
    cy.get('.mb-3.row > :nth-child(2) > .w-100').click();
    cy.get('.d-flex > .btn-secondary').click();
    cy.get('.mb-3.row > :nth-child(2) > .w-100').click();
    cy.get('.d-flex > .btn-primary').click();
  })

  it('filterVariantNameTest', () => {
    //Anmelden
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select Repo
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    //go to Variants
    cy.get('[href="/variants"]').click();
    cy.get(':nth-child(2) > .mb-3 > .form-control').type("new");
    cy.contains("NewName").click();
    cy.get(':nth-child(2) > .mb-3 > .form-control').clear();
    cy.get(':nth-child(2) > .mb-3 > .form-control').type("T");
    cy.contains("Test2").click();
    cy.contains("Test1").click();
    cy.get(':nth-child(2) > .mb-3 > .form-control').clear();
    cy.get(':nth-child(2) > .mb-3 > .form-control').type("only");
    cy.contains("Test2").click();
  })

  it('filterVariantForFeatureTest', () => {
    //Anmelden
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select Repo
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    //go to Variants
    cy.get('[href="/variants"]').click();

    cy.get('.mb-3 > .dropdown-toggle').click();
    cy.contains('WEATHER').click();
    cy.contains('Test1').click();
    cy.get('.btn-outline-primary').click();
    cy.contains("NewName").click();
  })

  it('editVariantTest', () => {
    //Anmelden
    cy.visit('/');
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select Repo
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    //go to Variants
    cy.get('[href="/variants"]').click();
    cy.get(':nth-child(1) > [style="min-width: 80%;"] > .float-end > .btn').click();
    //set name
    cy.get('[style="min-width: 20%;"] > .w-100 > .form-control').clear();
    cy.get('[style="min-width: 20%;"] > .w-100 > .form-control').type('Test3');
    //set description
    cy.get('.float-end > .w-100 > .form-control').clear();
    cy.get('.float-end > .w-100 > .form-control').type('BASE and WEATHER');
    cy.get('[style="min-width: 80%;"] > .float-end > :nth-child(2) > .bi').click();
    //+ Button
    cy.get('.mr-auto > .row > .col').click();
    cy.get('.dropdown > .dropdown-menu > :nth-child(1)').click();

    //filter
    cy.get('.mb-3 > .dropdown-toggle').click();
    cy.get('.mb-3 > .dropdown-menu > :nth-child(1)').click();
    cy.contains('Test1');
    cy.contains('Test3');
    cy.get(':nth-child(1) > [style="min-width: 80%;"] > .float-end > .btn').click();
    cy.get('.d-flex > .ms-1 > .bi').click();
    //set name
    cy.get('[style="min-width: 20%;"] > .w-100 > .form-control').clear();
    cy.get('[style="min-width: 20%;"] > .w-100 > .form-control').type('Test2');
    //set description
    cy.get('.float-end > .w-100 > .form-control').clear();
    cy.get('.float-end > .w-100 > .form-control').type('only "Base"');
    cy.get('[style="min-width: 80%;"] > .float-end > :nth-child(2) > .bi').click();
    //delete Feature
    cy.get(':nth-child(2) > .float-end > :nth-child(2) > .bi').click();
  })

  //deactivated for non-local tests
  /*
  it('checkoutVariantTest', () => {
    //log in
    cy.visit(HTTP_PATH);
    cy.get('#formBasicEmail').type('Tobias');
    cy.get('#formBasicPassword').type('admin');
    cy.contains('Sign').click();
    cy.wait(1000);

    //select repository
    cy.contains("BigHistory_full").click();
    cy.get('.d-flex > :nth-child(2) > :nth-child(1)').click();
    //go to variants
    cy.get('[href="/variants"]').click();
    cy.contains("Test1").click();
    //download
    cy.get(':nth-child(5) > :nth-child(2) > .w-100').click();
    //wait till download is done
    cy.readFile('cypress/downloads/checkout.zip').should('exist');

    //execute of JS-File compareDownload.js
    cy.exec('node cypress/compareDownload.js', { timeout: 10000 })
    .then((result) => {
      // check result
      const output = result.stdout.trim();
      const isSuccess = output === 'True';
      expect(isSuccess).to.be.true;
    });
  })
  */
});

