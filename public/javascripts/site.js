const domIsReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" 
    ? callback() 
    : document.addEventListener("DOMContentLoaded", callback);
};

domIsReady (function() {
    let re = /(\/[a-zA-Z]+|(\/))/ 
    let urlLocation = window.location.href.slice(7).match(re)

    let reg = /([a-z]+:\/\/[a-zA-Z0-9:]+)|(\/[a-zA-Z0-9]+)+/
    let trailingPath = window.location.href.split('/')//.match(reg)
    // console.log(`/${trailingPath.slice(3, ).join('/')}`)
    // console.log(window.location.origin)

    let nav = document.querySelector(".nav")
    let navLinks = nav.querySelectorAll('.nav-link')
    Array.from(navLinks).forEach(element => {

        if (element.getAttribute("href") === `/${trailingPath.slice(3, ).join('/')}`) {
            element.parentNode.style.backgroundColor = '#909090'
        }
        else {
            element.parentNode.style.backgroundColor = ''
        }
    })

    let scrollLocation;

 // This section controls theme

    let theme = document.querySelector('.toggle-theme');
    let root = document.querySelector(':root');

    let oasisLogocolor = document.querySelector('#oasis-blue');

    // Show or hides input form
    // let formDiv = document.querySelector('.form-div');
    // let toggleform = document.querySelector('.toggle-form');
    // let togFormPath = toggleform.querySelector('svg path');

    // toggleform.addEventListener('click', (e) => {
    //     if(formDiv.style.display === 'block'){
    //         formDiv.style.display = 'none';
    //         localStorage.setItem('inputForm', true);
    //     }else{
    //         formDiv.style.display = 'block';
    //         localStorage.removeItem('inputForm');
    //     }
    // });

    // if(localStorage.getItem('inputForm')){
    //     formDiv.style.display = 'none'
    // }

    function setTheme(e) {
        if(document.documentElement.hasAttribute('theme')){
            document.documentElement.removeAttribute('theme');
            // togFormPath.setAttribute('fill', ' hsl(350, 5%, 15%)');
            oasisLogocolor.setAttribute('stop-color', 'blue');
            localStorage.removeItem('theme'); 
        }
        else{
            document.documentElement.setAttribute('theme', 'dark');
            // togFormPath.setAttribute('fill', 'hsl(350, 9%, 89%)');
            oasisLogocolor.setAttribute('stop-color', 'lightblue');
            localStorage.setItem('theme', 'dark');
        }
    }

    if(localStorage.getItem('theme')){
        document.documentElement.setAttribute('theme', 'dark');
        // togFormPath.setAttribute('fill', 'hsl(350, 9%, 89%)');
        oasisLogocolor.setAttribute('stop-color', 'lightblue');
    }
 
    theme.addEventListener('click', setTheme);

    let cacheBust = () => Math.floor(Math.random(1000) * 99999);

/**********************select js areas based on route******************************/
    // let checkAllValid = {};
    if (trailingPath.includes('login')) {
        validateLoginForm()
    }
    if (trailingPath.includes('register')) {
        validateRegisterForm()
    }

    
/***************Cient Side Form Validation****************************/
    
    const validateField = {
        getMessages: function (field) {
            const msgs = []
            msgs.push(validateField.lengthCheck(field, { min: 6, max: 8 }))
            msgs.push(validateField.lowercaseCheck(field))
            msgs.push(validateField.uppercaseCheck(field))
            msgs.push(validateField.numberCheck(field))
            msgs.push(validateField.specialCharactersCheck(field))
            msgs.push(validateField.repeatCharactersCheck(field))
            return msgs
        },
        characterTypeCheck: function (field, regex, type) {
            const matches = field.match(regex) || []
          
            if (matches.length === 0) {
              return {
                message: `Your password has no ${type}`,
                checkOk: false
              }
            }
          
            if (matches.length < 1) {
              return {
                message: `Your password could use more ${type}`,
                checkOk: false
              }
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            }
        },
        lengthCheck: function(field, {min = 2, max = 6}) {
            const length = field.length
            
            if (field == undefined) {
                return {
                message: `This field must contain at least ${max} characters`,
                checkOk: ''
                }
            }
            
            if (length < max) {
                return {
                message: `This field must contain at least ${max} characters`,
                checkOk: false
                }
            }
            return {
                message: '',
                checkOk: true
            }
        },
        uppercaseCheck: function(field) {
            return validateField.characterTypeCheck(field, /[A-Z]/g, 'uppercase characters')
        },
        lowercaseCheck: function(field) {
            return validateField.characterTypeCheck(field, /[a-z]/g, 'lowercase characters')
        },
        numberCheck: function(field) {
            return validateField.characterTypeCheck(field, /[0-9]/g, 'numbers')
        },
        specialCharactersCheck: function(field) {
            return validateField.characterTypeCheck(field, /[^0-9a-zA-Z\s]/g, 'special characters')
        },
        repeatCharactersCheck: function(field) {
            const matches = field.match(/(.)\1/g) || []
            if (matches.length > 0) {
                return {
                message: 'Your password has repeat characters',
                checkOk: false
                }
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            }
        },
        matchCharacters: function(field) {
            const matches = field.match(/[^A-Za-z\.\'\-0-9]+/g) || []
            if (matches.length > 0) {
                return {
                message: 'Field contains illegal characters, only A-Za-z0-9.\' allowed',
                checkOk: false
                }
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            }
        },
        matchEmailDomain: function(field) {
            const matches = field.match(/@oasiscws.com/g) || []
            // console.log(matches)
            if (matches.length === 0) {
                return {
                message: 'Only the @oasiscws.com domain is allowed.',
                checkOk: false
                }
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            }
        },
        matchEmail: function(field) {
            const matches = field.match(/[a-zA-Z0-9\_\-\.\+]+@oasiscws.com/g) || [] // !#$%&'*+-/=?^_`{|}~ [^_-\.\+]
            if (matches.length === 0) {
                return {
                message: 'Email not valid format at this point.',
                checkOk: false
                }
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            }
        },
        confirmPassword: function(confirmfield, passwordfield){
            if (confirmfield !== passwordfield) {
                return {
                message: 'Confirm password does not match password.',
                checkOk: false
                }
            }
            return {
                message: '',
                checkOk: confirmfield !== "" ? true : false
            }
        },
    }

    function messagesToElements(el, msgs) {
        el.target.nextElementSibling.innerHTML = ''
        msgs.forEach(msg => {
            if(msg.message !== '') {
                const messageEl = document.createElement('div')
                messageEl.innerText = msg.message
                el.target.nextElementSibling.appendChild(messageEl)
            }
        })
    }

    function validatePwField(e) {
        const msgs = validateField.getMessages(e.target.value)
        messagesToElements(e, msgs)
    }

/*******************************************************************/

    function validateRegisterForm () {
        let registerForm = document.querySelector('#register');
        let registerSubmitBtn = registerForm.querySelector('.btn');
        let registerInputCollection = registerForm.querySelectorAll('.form-control');
        let passwordInput = registerForm.querySelector('input[name="password"]')
        
        registerSubmitBtn.disabled = true

        const validForm = () => {
            let formOKtoSubmit = Array.from(registerForm.querySelectorAll('input')).map(el => el.classList.contains('validityChecked') ? 'true' : 'false').includes('false')
            if(formOKtoSubmit){
                registerSubmitBtn.disabled = true
            }else{
                registerSubmitBtn.disabled = false
            }
        }

        
        Array.from(registerInputCollection).forEach(el => {
            
            el.addEventListener('keyup', (el) => {
                if (el.target.value !== "" && el.target.nextElementSibling.innerHTML === "") {
                    el.target.classList.add("validityChecked")
                } else {
                    el.target.classList.remove("validityChecked")
                }
                validForm()
            });
            if (el.getAttribute('name') === 'password') {
                el.addEventListener('input', validatePwField);
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        validatePwField(el);
                    }
                    
                })
            }

            if (el.getAttribute('name') === 'firstname' || el.getAttribute('name') === 'lastname') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.lengthCheck(el.target.value, {min: 1, max: 3}),
                        validateField.matchCharacters(el.target.value)
                    ]
                    messagesToElements(el, msgs);
                })
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.lengthCheck(el.target.value, {min: 1, max: 3}),
                            validateField.matchCharacters(el.target.value)
                        ]
                        messagesToElements(el, msgs);
                    }
                    
                })
            }

            if (el.getAttribute('name') === 'email') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.matchEmailDomain(el.target.value),
                        validateField.matchEmail(el.target.value)
                    ];
                    messagesToElements(el, msgs);
                });
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.matchEmailDomain(el.target.value),
                            validateField.matchEmail(el.target.value)
                        ];
                        messagesToElements(el, msgs);
                    }
                });
            }

            if (el.getAttribute('name') === 'confirmpassword') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.confirmPassword(el.target.value, passwordInput.value)
                    ]
                    messagesToElements(el, msgs);
                });
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.confirmPassword(el.target.value, passwordInput.value)
                        ];
                        messagesToElements(el, msgs);
                    }
                });
            }
            
        });

        registerSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            registerForm.querySelector('form').submit();

        });
    }



    function validateLoginForm() {
        console.log('validateLoginForm');
        let loginForm = document.querySelector('#login');
        let loginSubmitBtn = loginForm.querySelector('.btn');
        let loginEmail = loginForm.querySelector('input[name="email"]');
        let passwordInput = loginForm.querySelector('input[name="password"]');
        
        loginSubmitBtn.disabled = true;

        const validForm = () => {
            let formOKtoSubmit = Array.from([loginEmail, passwordInput]).map(el => el.classList.contains('validityChecked') ? 'true' : 'false').includes('false')
            if(formOKtoSubmit){
                loginSubmitBtn.disabled = true
            }else{
                loginSubmitBtn.disabled = false
            }
        }

        Array.from([loginEmail, passwordInput]).forEach(el => {
            
            el.addEventListener('keyup', (el) => {
                if (el.target.value !== "" && el.target.nextElementSibling.innerHTML === "") {
                    el.target.classList.add("validityChecked")
                } else {
                    el.target.classList.remove("validityChecked")
                }
                validForm()
            });
            if (el.getAttribute('name') === 'password') {
                el.addEventListener('input', validatePwField);
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        validatePwField(el);
                    }
                    
                })
            }

            if (el.getAttribute('name') === 'email') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.matchEmailDomain(el.target.value),
                        validateField.matchEmail(el.target.value)
                    ];
                    messagesToElements(el, msgs);
                });
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.matchEmailDomain(el.target.value),
                            validateField.matchEmail(el.target.value)
                        ];
                        messagesToElements(el, msgs);
                    }
                });
            }
        });

        loginSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            loginForm.querySelector('form').submit();

        });
    }

    if (trailingPath.includes('dashboard')) {
        supportForm()
    }

    function supportForm(){
        // Main form Selectors
        const entryFormOpen = document.querySelector('.open-hidden');
        const entryFormWrapper = document.querySelector('.form-wrapper');
        const entryForm = entryFormWrapper.querySelector('.entry-form')
        const createdBy = entryFormWrapper.querySelector('input[name=Created-By]');
        const ticketNumber = entryFormWrapper.querySelector('input[name=ticket-number]');
        const machineList = entryFormWrapper.querySelector('#machineList');
        const problemList = entryFormWrapper.querySelector('#problemList');
        const partsneeded = entryFormWrapper.querySelector('#pn');
        const partsmissing = entryFormWrapper.querySelector('#pm');

        // Search Pop-up Selectors
        const searchModal = document.querySelector('.search-wrapper');
        const searchFields = searchModal.querySelectorAll('.search-field');
        const bodyNumTarget = searchModal.querySelector('#n-search');
        const btnCloseSearchModal = searchModal.querySelector('#btn-close-modal');
        
        setSelectMenus('/api/machinetypes/all', machineList, 'machinename', `machineType`);
        setSelectMenus('/api/problemcatagory/all', problemList, `catagoryname`);

        entryFormOpen.addEventListener('click', (e) => {
            if(entryFormWrapper.style.display === 'block'){
                entryFormWrapper.style.display = 'none';
                entryForm.reset()
            }else{
                entryFormWrapper.style.display = 'block';
                getTicketNumber(ticketNumber);
                 createdBy.value = getUserId();
            }
        })

        function closeSearchModal(e){
            searchModal.style.display = 'none';
            bodyNumTarget.innerHTML = ``;
            Array.from(searchModal.querySelectorAll('.search-field')).forEach(item => item.value = "")
        }

        btnCloseSearchModal.addEventListener('click', closeSearchModal);

        let selectedSearchDiv = "";

        partsneeded.addEventListener('click', getPartsSearch);
        partsmissing.addEventListener('click', getPartsSearch);

        async function getPartsSearch(elMagGlass) {
            // elMagGlass.stopPropagation();
            elMagGlass.preventDefault();
            selectedSearchDiv = this.parentNode.querySelector('input')//elMagGlass.target.parentNode;
            searchModal.style.display = 'block';
        }

        Array.from(searchFields).forEach(input => {
            input.addEventListener('input', async(inputEl)=>{
                inputEl.preventDefault();
                // inputEl.stopPropagation();
                let searchParameter = inputEl.target.value;
                let apiUrl = inputEl.target.getAttribute('id') === 'number-search' ? 'pn' : 'desc';

                let timer
                bodyNumTarget.innerHTML = ``
                clearTimeout(timer)
                if (searchParameter === "*" || searchParameter.length > 2) {
                    timer = setTimeout(async ()=>{
                        bodyNumTarget.innerHTML = ``
                        const lookupResult = await getData(`${window.location.origin}/api/parts/${apiUrl}/${searchParameter}`, 'GET', {data: 'yes'})
                        .then(res => {
                            res.forEach((item, i) => {
                                let elContainer = document.createElement("div");
                                elContainer.style.paddingTop = '.5rem';
                                elContainer.setAttribute('data-key', item._id);
                                elContainer.setAttribute('id', `result-${i}`);
                                elContainer.classList.add('search-res');
                                if(i%2 === 0) {
                                    elContainer.classList.add('bground-color');
                                }

                                elContainer.addEventListener('click', (e) => {
                                    selectedSearchDiv.value = `${item.partNumber} ${item.description}`;
                                    closeSearchModal()
                                })

                                bodyNumTarget.appendChild(elContainer);

                                let elNum = document.createElement("div");
                                elNum.style.width = '17%';
                                elNum.style.display = 'inline-block';
                                elNum.innerText = item.partNumber;
                                elContainer.appendChild(elNum);

                                let elDesc = document.createElement("div");
                                elDesc.style.width = '80%';
                                elDesc.style.display = 'inline-block';
                                elDesc.innerText = item.description;
                                elContainer.appendChild(elDesc);
                            })
                            
                        })
                        .catch(e => console.log(`Error getData: ${e}`))
                    },250)
                }
            })
        })
    }

/*******************************************************************/

    async function getTicketNumber (ticketNumEL) {
        try {
            const result = await getData(`${window.location.origin}/autoinc`, 'GET', {data: 'yes'});
            ticketNumEL.value = await result    
        } catch (error) {
            console.log(error)
        }
    }

    function setSelectMenus(url, selector, typeValue1 , typeValue2='') {
        getData(`${window.location.origin}${url}`, 'GET', {data: 'yes'})
        .then(list => {
            let optstr= '';
            list.forEach(type => {
                let opt = document.createElement('option');
                opt.value = `${type[typeValue1]}  ${type[typeValue2] ? type[typeValue2] : ""}`;
                selector.appendChild(opt); 
            })
        })
        .catch(e => console.log(e))
    }

    function getUserId(){
        const userid = document.querySelector('input[name=userId]');
        return userid.value;
    }
    
    async function getData(url = '', method, data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header

        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
})