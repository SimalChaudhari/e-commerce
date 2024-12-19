import { useEffect, useState } from 'react';

import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';
import { paths } from 'src/routes/paths';

const icon = (name) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);
const ICONS = {
  dashboard: icon('ic-dashboard'),
  products: icon('ic-product'),
  vendors: icon('ic-kanban'),
  orders: icon('ic-order'),
  settings: icon('ic-lock'),
  stocks: icon('ic-job'),
  ledger: icon('ic-invoice'),
  logout: icon('ic-external'),
  account: icon('ic-tour'),
  analytics: icon('ic-analytics'),
  receivables: icon('ic-ecommerce'),
};

export const useNavData = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const handleRoleChange = () => {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      setUserRole(userData?.user?.role || null);
    };

    window.addEventListener('storage', handleRoleChange);
    handleRoleChange(); // Initial fetch

    return () => {
      window.removeEventListener('storage', handleRoleChange);
    };
  }, []);

  const commonItems = [
    {
      subheader: 'Dashboard',
      items: [

        { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      ],
    },

  ];
  const adminItems = [
    {
      subheader: 'Management',
      items: [
        { title: 'Products', path: paths.products.root, icon: ICONS.products },
        { title: 'Vendors', path: paths.vendors.root, icon: ICONS.vendors },
      ],
    },

  ];

  const reportsItem = [
    {
      subheader: 'Reports',
      items: [
        { title: 'Order Reports', path: paths.orders.root, icon: ICONS.orders },
        {
          title: 'Accounting',
          path: paths.accounts.root,
          icon: ICONS.account,
          children: [
            { title: 'Ledger Statement', path: paths.accounts.ledger },
            { title: 'Outstanding Amount', path: paths.accounts.receivable },
          ],
        },
        { 
          title: 'Inventory',
          path: paths.stocks.root,
          icon: ICONS.stocks,
          children: [{ title: 'Stocks', path: paths.stocks.root }],
        },



      ],
    }

  ]


  const reportsVendorsItem = [
    {
      subheader: 'Reports',
      items: [
        { title: 'Orders Reports', path: paths.orders.root, icon: ICONS.orders },
        {
          title: 'Accounting',
          path: paths.accounts.root,
          icon: ICONS.account,
          children: [
            { title: 'Ledger Statement', path: paths.accounts.ledger },
            { title: 'Outstanding Receivables', path: paths.accounts.receivable },
          ],
        },
      ],
    }

  ]


  const vendorItems = [
    {
      subheader: 'Sales',
      items: [
        { title: 'Sales Order', path: paths.items.root, icon: ICONS.products },
      ],
    },

  ];

  const vendorSettingsItem = [
    {
      subheader: 'Settings',
      items: [
        {
          title: 'Profile',
          path: paths.settings.profile,
          icon: ICONS.settings,
        },

        { title: 'Logout', path: paths.logout.root, icon: ICONS.logout },
      ],
    },
  ]

  const settingsItems = [
    {
      subheader: 'Settings',
      items: [
        {
          title: 'Settings',
          path: paths.settings.root,
          icon: ICONS.settings,
          children: [
            { title: 'Profile', path: paths.settings.profile },
            { title: 'Sync Setting', path: paths.settings.sync },
            { title: 'Banner Setting', path: paths.settings.banner },
            { title: 'Tally Setting', path: paths.settings.tally },
            { title: 'Contact Us', path: paths.settings.contact_us },
            { title: 'FAQs', path: paths.settings.faq },
            { title: 'Terms & Conditions', path: paths.settings.terms_conditions },
          ],
        },

        { title: 'Logout', path: paths.logout.root, icon: ICONS.logout },
      ],
    },
  ];

  const payments = [
    {
      subheader: 'Payments',
      items: [
        {
          title: 'Make Payment',
          path: paths.payments.root,
          icon: ICONS.dashboard,
        },
      ]
    },

  ];

  const paymentsVendor = [
    {
      subheader: 'Payments',
      items: [
        {
          title: 'Make Payment',
          path: paths.payments.viewPayment,
          icon: ICONS.dashboard,
        },
      ]
    },

  ];

  const logsHistory = [
    {
      subheader: 'Logs',
      items: [
        { title: 'Logs', path: paths.logs.root, icon: ICONS.dashboard },
      ],
    },

  ];

  const navData = [
    ...commonItems,
    ...(userRole === 'Admin' ? [...adminItems, ...reportsItem,  ...payments,...logsHistory, ...settingsItems,] : []),
    ...(userRole === 'Vendor' ? [...vendorItems, ...reportsVendorsItem, ...paymentsVendor, ...vendorSettingsItem] : []),
  ];

  return navData;
};
