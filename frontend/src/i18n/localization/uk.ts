import { table } from "console";

export const uk = {
  uk: {
    translation: {
      defaultLayout: {
        login: "Увійти",
      },
      loginView: {
        loginHeader: "Авторизація",
        usernameLabel: "Ім'я користувача",
        passwordLabel: "Пароль",
        login: "Увійти",
        rememberMe: "Запам'ятати мене",
        register: "Реєстрація",
      },
      registerView: {
        registerHeader: "Реєстрація",
        register: "Зареєструватись",
        login: "Вже маєте аккаунт?",
        repeatPassword: "Повторіть пароль",
      },
      mainView: {
        mainText: {
          0: "Від ідеї до API —",
          1: "миттєво",
        },
        subText:
          "Автоматизована альтернатива ручному створенню REST API. Почни проєкт із готового сервера.",
        getStarted: "Почати зараз",
        learnMore: "Дізнатися більше",
        features: {
          title: "Чому обирають нас?",
          subtitle:
            "Потужні інструменти для швидкого створення та розгортання REST API",
          api: {
            title: "REST API",
            description:
              "Автоматично генеровані REST ендпоінти з повною CRUD функціональністю",
          },
          database: {
            title: "База даних",
            description: "Автоматичне створення та налаштування таблиць бази даних",
          },
          instant: {
            title: "Миттєве розгортання",
            description: "Ваш API готовий до використання за лічені хвилини",
          },
          noCode: {
            title: "Без коду",
            description: "Створюйте API без написання жодного рядка коду",
          },
          cloud: {
            title: "Хмарна інфраструктура",
            description: "Надійна та масштабована хмарна інфраструктура",
          },
          scalable: {
            title: "Масштабованість",
            description: "Легко масштабуйте ваші API під зростаючі потреби",
          },
        },
        howItWorks: {
          title: "Як це працює?",
          subtitle: "Три простих кроки до готового API",
        },
        steps: {
          create: {
            title: "Створіть таблицю",
            description: "Визначте структуру ваших даних через простий інтерфейс",
          },
          design: {
            title: "Налаштуйте API",
            description: "Оберіть необхідні HTTP методи та налаштування",
          },
          deploy: {
            title: "Розгорніть API",
            description:
              "Ваш REST API автоматично розгортається та готовий до використання",
          },
        },
        cta: {
          title: "Готові почати?",
          subtitle:
            "Приєднуйтесь до тисяч розробників, які вже використовують нашу платформу",
          button: "Створити перший API",
        },
      },
      form: {
        required: "${label} є обов'язковим для заповнення!",
      },
      api: {
        lessThen8: "Пароль має бути не менше 8 символів і не більше 24 символів.",
        containLetter: "Пароль повинен містити хоча б один символ.",
        authorized: "Ви успішно авторизовані",
        wrongPassOrUsername: "Невірний логін або пароль",
        createdUser: "Користувач успішно створений",
        userExists: "Користувач с таким іменем вже існує",
        tableExists: "Таблиця вже існує",
        tableNotExists: "Таблиці не існує",
        createdTable: "Таблица успішно створена",
        tableEdited: "Таблиця успішно змінена",
        tableEmpty: "Таблиця пуста",
        rowAdded: "Запис успішно додано",
        rowDeleted: "Запис успішно видалено",
        badPassword: "Невірно введений пароль",
        passwordChanged: "Пароль успішно змінено",
        tableDeleted: "Таблиці успішно видалені",
        internalError: "Внутрішня помилка сервера",
      },
      rejects: {
        mustBe8Length: "Пароль має містити щонайменше 8 символів",
        mustBe24Long: "Пароль має містити менше 24 символів",
        containOneDigit: "Пароль повинен містити хоча б одну цифру",
        containOneLetter: "Пароль повинен містити хоча б одну літеру",
        repeatPassword: "Повторіть пароль",
        repeatPasswordNotEqual: "Паролі не схожі",
        tableNameRequired: "Ім'я таблиці є обов'язковим для заповнення",
        methodsRequired: "Методи є обов'язковими для заповнення",
        fieldsNotFilled: "Не всі поля заповнені",
        internalServerError: "Внутрішня помилка сервера",
      },
      profileLayout: {
        general: "Загальні",
        username: "Ім'я користувача",
        role: "Роль",
        USER: "Користувач",
        ADMIN: "Адміністратор",
        security: "Безпека",
        oldPassword: "Минулий пароль",
        newPassword: "Новий пароль",
        repeatPassword: "Повторіть новий пароль",
        changePassword: "Змінити пароль",
        adminPanel: "Адмін-панель",
      },
      notFound: {
        subTitle: "Вибачте, сторінка, яку ви відвідали, не існує.",
        button: "Назад додому",
      },
      tableView: {
        name: "Ім'я таблиці",
        methods: "Доступні методи",
        path: "Шлях до таблиці",
        add: "Додати таблицю",
        delete: "Видалити таблицю",
        emptyRows: "Оберіть таблицю для видалення",
      },
      tableCreateView: {
        createHeader: "Створення таблиці",
        create: "Створити таблицю",
        tableName: "Ім'я таблиці",
        methods: "Методи",
        tableNameRequired: "Ім'я таблиці є обов'язковим для заповнення",
        methodsRequired: "Методи є обов'язковими для заповнення",
        available: "Доступні",
        selected: "Обрані",
        fieldName: "Ім'я поля",
        fieldType: "Тип поля",
        isCanBeNull: "Може бути null",
        isUnique: "Унікальне",
        createSuccess: "Таблиця успішно створена",
      },
      tableInfoView: {
        editHeader: "Редагування таблиці",
        update: "Оновити таблицю",
        updateSuccess: "Таблиця успішно оновлена",
      },
      common: {
        cancel: "Скасувати",
      },
    },
  },
};
