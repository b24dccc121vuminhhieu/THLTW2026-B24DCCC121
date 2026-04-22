export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},


	{
	name: 'baitap01',
	path: '/baitap01',
	icon: 'AppstoreOutlined',
	routes: [
		{
			name: 'b1',
			path: 'b1',
			component: '@/components/b1/index',
		},
		{
			name: 'b2',
			path: 'b2',
			component: '@/components/b2/index',
		},
	],
},
   
    {
    name: 'baitap02',
    path: '/baitap02',
    icon: 'AppstoreOutlined',
    routes: [
    {
      name: 'Bai1',
      path: 'bai1',
      component: '@/components/bai1/index',
    },
    {
      name: 'Bai2',
      path: 'bai2',
      component: '@/components/bai2/index',
		},
	],
},

    {
	name: 'baitap03',
    path: '/baitap03',
	icon: 'AppstoreOutlined',
	routes: [
	{
	  name: 'Bai1th03',
	  path: 'bai1th03',
	  component: '@/components/bai1th3/index',

	    },
	],
},
 
    {
	name: 'baitap04',
	path: '/baitap04',
	icon: 'AppstoreOutlined',
	routes: [
	{
		name: 'Bai1th04',
		path: 'bai1th04',
		component: '@/components/bai1th4/index',
	    
		},
    ],
},

{
	name: 'baitap05',
	path: '/baitap05',
	icon: 'AppstoreOutlined',
	routes: [
	{
		name: 'Bai1th05',
		path: 'bai1th05',
		component: '@/components/bai1th5/index',
	    
		},
    ],
},

{
	name: 'baitap06',
	path: '/baitap06',
	icon: 'AppstoreOutlined',
	routes: [
	{
		name: 'Bai1th06',
		path: 'bai1th06',
		component: '@/components/bai1th6/index',
	    
		},
    ],
},

{
	name: 'baitap07',
	path: '/baitap07',
	icon: 'AppstoreOutlined',
	routes: [
	{
		name: 'Bai1th07',
		path: 'bai1th07',
		component: '@/components/bai1th7/index',
	    
		},
    ],
},


{
	name: 'baigiuaky',
	path: '/baigiuaky',
	icon: 'AppstoreOutlined',
	routes: [
	{
		name: 'baigiuaky',
		path: 'baigiuaky',
		component: '@/components/baigiuaky/index',
	    
		},
    ],
},


	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];

	