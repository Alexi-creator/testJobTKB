'use strict';

class AddPersonal {

    constructor(form) {
        this.form = document.querySelector(form);
        this.tbody = this.form.querySelector('tbody');
        this.template = document.querySelector('#template-personal-row');

        this.btnAdd = '.form__button--add';
        this.btnSend = '.form__button--send';
        this.btnRemoveRow = '.button--remove-row';

        this.validateForm = false;

        this.error = !this.form || !this.tbody || !this.template;

        if (this.error) {
            console.error('not found elements!');            
            return;
        }

        this.init();
    }

    init() {
        this.handlers();
    }

    serealize() {
        const formData = new FormData(this.form);

        const body = [];
        let obj = {};

        formData.forEach((v, k) => {
            obj[k] = v;

            if (k === 'competencies') {
                body.push(obj);
                obj = {};
            }
        })

        return { ...body };
    }

    validateAge(field) {
        const parent = field.closest('.form__item');

        if (field.value < 18 || field.value > 150) {
            parent.classList.add('form__item--error');
        } else {
            parent.classList.remove('form__item--error');
        }
    }

    validateName(field) {
        const parent = field.closest('.form__item');

        field.value = field.value.replace(/\s\s/gi, '');
        field.value = field.value.replace(/^\s/gi, '');

        if (field.value.length < 3 || /\d/g.test(field.value)) {
            parent.classList.add('form__item--error');
        } else {
            parent.classList.remove('form__item--error');
        }
    }

    validate(element) {
        switch (element.name) {
            case "name":
                this.validateName(element);
                break;

            case "age":
                this.validateAge(element);
                break;
        
            default:
                break;
        }
    }

    async sendData(data) {
        try {
            let response = await fetch('personal.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(data)
            });
        
            let result = await response.json();
            console.log(result);
        } catch(e) {
            console.error(e);
        }
    }

    beforeSendData() {
        const requireds = this.form.querySelectorAll("input[required]");

        requireds.forEach(element => {
            this.validate(element);
        });

        if (this.form.querySelector('.form__item--error')) {
            return;
        }

        const dataSerealize = this.serealize();

        this.sendData(dataSerealize);
    }

    removeRow(target) {
        target.closest('tr').remove();
    }

    addRow() {
        const content = this.template.innerHTML;
        this.tbody.insertAdjacentHTML('beforeend', content);
    }

    inputHandler(e) {
        this.validate(e.target);
    }

    clickHandler(e) {
        e.preventDefault();
        const target = e.target;

        if (target.closest(this.btnAdd)) {
            this.addRow();
        }

        if (target.closest(this.btnSend)) {
            this.beforeSendData();
        }

        if (target.closest(this.btnRemoveRow)) {
            this.removeRow(target);
        }
    }

    handlers() {
        document.addEventListener('click', this.clickHandler.bind(this));
        this.form.addEventListener('input', this.inputHandler.bind(this));
    }
}
