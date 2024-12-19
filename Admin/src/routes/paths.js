
const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://www.alovate.io/',
  changelog: 'https://www.alovate.io/',
  zoneStore: 'https://www.alovate.io/',
  minimalStore: 'https://www.alovate.io/',
  freeUI: 'https://www.alovate.io/',
  figma: 'https://www.alovate.io/',
  users: {
    root: `/users`,
    list: `/users/list`,
    details: (id) => `/users/${id}`,
    edit: (id) => `/users/${id}/edit`,
  },
  products: {
    root: `/products`,
    list: `/products/list`,
    create: '/products/create',
    details: (id) => `/products/${id}`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,
  },



  vendors: {
    root: `/vendors`,
    list: `/vendors/list`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,
  },
  orders: {
    root: `/orders`,
    list: `/orders/list`,
    details: (id) => `/orders/${id}`,
    view: (id) => `/view/${id}`,

  },

  stocks: {
    root: `/stocks`,
    list: `/stocks/list`,
    details: (id) => `/stocks/${id}`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,
  },

  accounts: {
    root: `/accounts`,
    ledger: `/accounts/ledger`,
    receivable: `/accounts/receivable`,
    viewReceivable: (id) => `/accounts/view/${id}`,
    viewLedger: (id) => `/accounts/view/${id}`,

  },

  settings: {
    root: `/settings`,
    faq: `/settings/faq`,
    create: `/create`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,

    contact_us: `/settings/contact-us`,
    terms_conditions: `/settings/terms-conditions`,
    profile: `/settings/profile-settings`,
    banner: `/settings/banner`,
    createBanner: `/create`,
    editBanner: (id) => `/edit/${id}`,
    viewBanner: (id) => `/view/${id}`,
    sync: `/settings/sync`,
    tally: `/settings/tally`,
  },

  payments: {
    root: `/payments`,
    payment: `/payments/list`,
    createPayment: `/create`,
    editPayment: (id) => `/edit/${id}`,
    viewPayment: `/payments/view`,
  },

  // Vendor  Panel 
  items: {
    root: `/items/checkout`,
    list: `/items/list`,
    checkout: `/items/checkout`,
    details: (id) => `/items/${id}`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,
  },

  // logs
  logs: {
    root: `/logs`,
    list: `/logs/list`,
  },


  logout: {
    root: `/logout`
  },
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,

  },
};
