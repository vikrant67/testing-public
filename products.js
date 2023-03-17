/**
 * @author Pratiksha Goyal
 * @author Vishal Gauba
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SociollaCore = require('sociolla-core');
const autoIncrement = SociollaCore.MongooseAutoIncrement;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug, { separator: '-' });
const vnToLatin = SociollaCore.Helper.VNToLatinConverter;

const StoreSchema = new Schema({
	_id: false,
	id: Schema.Types.ObjectId,
	sociolla_my_sql_id: { type: Number, default: 0 },
	pos_my_sql_id: { type: Number, default: 0 },
	alias: String,
	stock: { type: Number, default: 0 },
	safety_stock: Number,
	is_sellable: { type: Boolean, default: true },
	is_active: { type: Boolean, default: true },
	type: { type: String, default: 'physical_store', enum: ['physical_store', 'vending_machine'] },
});

const CategorySchema = new Schema({
	_id: false,
	id: { type: Schema.Types.ObjectId, ref: 'categories' },
	my_soco_sql_id: Number,
	my_sociolla_sql_id: Number,
	is_show_category: Boolean,
	name: String,
	slug: String,
	is_promotion: { type: Boolean, default: false },
	is_shop_by_departement: { type: Boolean, default: false },
	product_price_rule_id: { type: Schema.Types.ObjectId, ref: 'product_price_rules' },
});

const DiscountSchema = new Schema({
	_id: false,
	my_sociolla_sql_id: Number,
	from_date: Date,
	end_date: Date,
	updated_at: Date,
	deduction_type: { type: String, enum: ['percentage', 'amount'] },
	deduction_percentage: Number,
	deduction_amount: Number,
	deduction_for_sociolla: Number,
	deduction_for_brand: Number,
	apply_discount_for: [
		{
			type: String,
			enum: [
				'all',
				'sociolla',
				'ios',
				'android',
				'brand_page',
				'offline_store',
				'offline_store_vn',
				'lulla',
				'lulla_ios',
				'lulla_android',
				'sociolla_vn',
				'sociolla_vn_android',
				'sociolla_vn_ios',
				'all_vn',
				'carasun',
				'cosrx',
			],
		},
	],
	stores: [
		{
			_id: false,
			id: Schema.Types.ObjectId,
			alias: String,
		},
	],
	tactical_promo_type: { type: String, enum: [null, 'sociolla_sale', 'sociolla_deals'] },
	is_flashsale: { type: Boolean, default: false }, // for discount priority
	is_tactical_sales: { type: Boolean, default: false }, // for discount priority after flash sale
	product_price_rule_id: { type: Schema.Types.ObjectId, ref: 'product_price_rules' },
	product_price_rule_name: String, // Name of discount

	/** for flashsale */
	total_quota: { type: Number, default: 0 },
	max_item: { type: Number, default: 0 },
	sold_quota: { type: Number, default: 0 },
	starting_counter: { type: Number, default: 0 },
	is_show_as_percentage: { type: Boolean },
});

const PreorderSchema = new Schema({
	start_date: Date,
	end_date: Date,
	product_preorder_rules_id: { type: Schema.Types.ObjectId, ref: 'product_preorder_rules' },
	total_quota: { type: Number, default: 0 },
	sold_quota: { type: Number, default: 0 },
	per_user_quota: { type: Number, default: 0 },
	delivery_date: { type: Date },
	is_active_in_sociolla: { type: Boolean },
	is_active_in_lulla: { type: Boolean },
	is_active_in_sociolla_vn: { type: Boolean },
	is_active_in_carasun: { type: Boolean },
	is_active_in_cosrx: { type: Boolean },
	created_at: Date,
	updated_at: Date,
});

const ImageSchema = new Schema({
	_id: false,
	my_sociolla_sql_id: Number,
	url: String,
	is_cover: { type: Boolean, default: false },
	is_lilla_cover: { type: Boolean, default: false },
	is_cosrx_cover: { type: Boolean, default: false },
	position: Number,
	legend: String, // alt text
	deleted_at: Date,
});

const VideoSchema = new Schema({
	_id: false,
	url: String,
	position: Number,
	description: String,
	my_sociolla_sql_id: Number,
});

const AttributeSchema = {
	id: { type: Schema.Types.ObjectId, ref: 'attributes' },
	value: String,
	my_soco_sql_id: Number,
	name: String,
};

const DigitalPriceTagSchema = new Schema({
	esl_id: String,
	esl_size: { type: String, enum: ['S', 'M', 'XL'] },
	store_id: Schema.Types.ObjectId,
});

const CombinationSchema = new Schema({
	/** Mask packages */
	total_masks: Number,
	saving: String, // (save 20%) on this package
	weight: { type: Number, default: 0 },

	my_soco_sql_id: Number,
	my_sociolla_sql_id: { type: Number, unique: true },

	/** default combination */
	is_default: Boolean,

	attributes: {
		size: AttributeSchema,
		shade: AttributeSchema,
		variant: AttributeSchema,
		non_specify: AttributeSchema,
	},

	images: [ImageSchema],
	video_url: String,
	ean_no: String,
	bpom_reg_no: String,
	bpom_expired_at: Date,
	others_ean_no: [String],
	product_number: String,
	reference: String,
	warehouse_location: String,
	margin: Number,
	available_for_guest: { type: Boolean, default: false },
	price: Number,
	reserved_qty: { type: Number, default: 0 }, //products which ordered but not shipped
	reserved_stock_marketplace: { type: Number, default: 0 },
	stock: { type: Number, default: 0 },
	safety_stock: Number,
	max_limit_per_order: Number,
	tax: Number,
	soco_stock: { type: Number, default: 0 },

	i18n: {
		// internationalization
		vi: {
			attributes: {
				size: AttributeSchema,
				shade: AttributeSchema,
				variant: AttributeSchema,
				non_specify: AttributeSchema,
			},

			/** default combination */
			is_default: Boolean,

			price: Number,
			video_url: String,
			warehouse_location: String,
			total_masks: Number,
			stock: { type: Number, default: 0 },
			safety_stock: Number,
			meta_keyword: String,
			product_number: String,
			max_limit_per_order: Number,
			images: [ImageSchema],
			ean_no: String,
			others_ean_no: [String],
			reference: String,
			stores: [StoreSchema],
			stock_market_place: { type: Number, default: 0 },
			reserved_qty: { type: Number, default: 0 },
			reserved_stock_marketplace: { type: Number, default: 0 },
			is_kill_product: { type: Boolean, default: false },
			weight: { type: Number, default: 0 },
			status_item: {
				type: String,
				enum: ['not_selected', 'active', 'to_be_discontinue', 'discontinue', 'new'],
				default: 'not_selected',
			},
		},
	},

	/** combination active in which platform */
	is_active_in_review: { type: Boolean, default: false },
	is_active_in_review_vn: { type: Boolean, default: false },
	is_active_in_sociolla: { type: Boolean, default: false },
	is_active_in_lulla: { type: Boolean, default: false },
	is_active_in_sociolla_vn: { type: Boolean, default: false },
	is_active_in_offline_store: { type: Boolean, default: false },
	is_active_in_offline_store_vn: { type: Boolean, default: false },
	is_active_in_offline_store_lilla: { type: Boolean, default: false },
	is_active_in_carasun: { type: Boolean, default: false },
	is_active_in_cosrx: { type: Boolean, default: false },
	is_active_in_b2b: { type: Boolean, default: false },
	is_active_in_event_microsite: { type: Boolean, default: false },
	is_active_in_event_microsite_vn: { type: Boolean, default: false },
	is_kill_product: { type: Boolean, default: false },

	is_limited: { type: Boolean, default: false },
	is_exclusive: { type: Boolean, default: false },
	is_out_of_stock_sociolla: { type: Boolean, default: false },
	is_out_of_stock_lulla: { type: Boolean, default: false },
	is_out_of_stock_sociolla_vn: { type: Boolean, default: false },
	enabled_in_freebies: { type: Boolean, default: false },
	is_out_of_stock_carasun: { type: Boolean, default: false },
	is_out_of_stock_cosrx: { type: Boolean, default: false },
	stock_market_place: { type: Number, default: 0 },
	discounts: [DiscountSchema],
	preorder: [PreorderSchema],
	stores: [StoreSchema],
	digital_price_tag: [DigitalPriceTagSchema],
	is_deleted: { type: Boolean, default: false },
	created_at: Date,
	deleted_at: Date,
	is_discontinue: { type: Boolean, default: false },
	b2b_market_type: {
		id: Schema.Types.ObjectId,
		code: String,
		business_type: {
			id: Schema.Types.ObjectId,
			code: String,
		},
	},
	status_item: {
		type: String,
		enum: ['not_selected', 'active', 'to_be_discontinue', 'discontinue', 'new'],
		default: 'not_selected',
	},
});

const ProductSchema = mongoose.Schema(
	{
		id: Number,
		my_sociolla_sql_id: Number,
		ninty_days_total_views: { type: Number, default: 0 },
		ninty_days_total_views_vn: { type: Number, default: 0 },
		name: { type: String, trim: true },
		i18n: {
			vi: {
				name: { type: String, trim: true },
				name_latin: { type: String, trim: true },
				description: String,
				short_description: String,
				how_to_use: String,
				ingredients: String,
				meta_title: String,
				meta_description: String,
				meta_keyword: String,
				categories: [CategorySchema],
				default_category: {
					id: { type: Schema.Types.ObjectId, ref: 'categories' },
					name: String,
					slug: String,
					my_soco_sql_id: Number,
					rating_types: [String],
				},
				/** parent_category is root of parent category, this different with default category  */
				parent_category: {
					id: { type: Schema.Types.ObjectId, ref: 'categories' },
					name: String,
					slug: String,
					link_rewrite: String,
					my_soco_sql_id: Number,
				},
				tags: [
					{
						_id: false,
						id: { type: Schema.Types.ObjectId, ref: 'tags' },
						my_soco_sql_id: Number,
						name: String,
						name_latin: String,
						level_name: String,
						is_campaign: { type: Boolean },
					},
				],
				is_whats_new: {
					is_active: { type: Boolean },
					is_active_in_sociolla: { type: Boolean },
					is_active_in_lulla: { type: Boolean },
					is_active_in_sociolla_vn: { type: Boolean, default: false },
					is_active_in_carasun: { type: Boolean, default: false },
					is_active_in_cosrx: { type: Boolean, default: false },
					created_at: Date,
				},
				is_bundle_pack: {
					is_active: { type: Boolean },
					is_active_in_sociolla: { type: Boolean },
					is_active_in_lulla: { type: Boolean },
					is_active_in_sociolla_vn: { type: Boolean, default: false },
					is_active_in_carasun: { type: Boolean, default: false },
					is_active_in_cosrx: { type: Boolean, default: false },
					created_at: Date,
				},
				is_limited: { type: Boolean, default: false },
				is_active_in_review: { type: Boolean, default: true },
				is_exclusive: { type: Boolean, default: false },
				is_online: { type: Boolean, default: false },
				is_product_testing: { type: Boolean, default: false },
				is_dangerous: { type: Boolean, default: false },
				is_kill_product: { type: Boolean, default: false },
				is_liquid: { type: Boolean, default: false },
				/** to set for brand page most popular, and for default sort on product list */
				is_most_popular: { type: Boolean, default: false },
				/** to set as event ticket eg. bff run, customer cannot combine other product with this in same order */
				is_product_ticket: { type: Boolean, default: false },
				/** to set as ture when the event is organized in soco platform */
				is_soco_event: { type: Boolean, default: false },
				/** if true, normal voucher cannot be applied, only is_super_product voucher can be applied */
				is_non_discounted: { type: Boolean, default: false },
				images: [ImageSchema],
				bogo_rules: [
					{
						name: String,
						voucher_id: Schema.Types.ObjectId,
						id: Number, // product id
						combination_id: Schema.Types.ObjectId,
						quantity: { type: Number, default: 0 },
						stock: { type: Number, default: 0 },
						from: Date,
						to: Date,
					},
				],
				two_days_total_views: { type: Number, default: 0 },
				total_orders: { type: Number, default: 0 },
				url_sociolla: String,
				margin: Number,
				awards: [
					{
						name: String,
						image: String,
						title: String,
						description: String,
						year: { type: Number, default: 0 },
					},
				],
				review_stats: {
					total_reviews: { type: Number, default: 0 },
					average_rating: { type: Number, default: 0 },
					/** rating types based on product's default category */
					average_rating_by_types: { type: Object, default: {} },
					total_recommended_count: { type: Number, default: 0 },
					total_repurchase_maybe_count: { type: Number, default: 0 },
					total_repurchase_no_count: { type: Number, default: 0 },
					total_repurchase_yes_count: { type: Number, default: 0 },
				},
			},
		},
		highest_order_price_lilla: {
			total_price: { type: Number, default: 0 },
			combination_id: Schema.Types.ObjectId,
		},
		/** url friendly */
		slug: {
			type: String,
			slug: ['my_sociolla_sql_id', 'name'],
			unique: true,
		},
		is_slug_updated: { type: Boolean, default: false },
		url_sociolla: String,
		description: String,
		short_description: String,
		how_to_use: String,
		ingredients: String,

		/** Start Size Chart */
		disclamer: String,
		size_chart_table: {
			size: {
				row: { type: Number, default: 0 },
				column: { type: Number, default: 0 },
			},
			table: [
				{
					title: String,
					rows: [
						{
							value: String,
						},
					],
				},
			],
			units: String,
			image: String,
			enabled: { type: Boolean, default: false },
		},
		/** End Size Chart */

		/** product images */
		images: [ImageSchema],
		videos: [VideoSchema],
		/** for SEO */
		meta_title: String,
		meta_description: String,
		meta_keywords: String,
		lulla: {
			meta_title: String,
			meta_description: String,
			meta_keywords: String,
		},
		carasun: {
			description: String,
			how_to_use: String,
			ingredients: String,
			meta_title: String,
			meta_description: String,
			meta_keywords: String,
			short_description: String,
		},
		cosrx: {
			description: String,
			how_to_use: String,
			ingredients: String,
			meta_title: String,
			meta_description: String,
			meta_keywords: String,
			short_description: String,
			skincare_step: String,
			product_comparison: String,
		},
		is_sale: { type: Boolean, default: false }, // helps identifing if any combination has any sort of discount or not
		is_sale_lilla: { type: Boolean, default: false }, // helps identifing if any combination has any sort of discount or not in lilla
		is_sale_sociolla_vn: { type: Boolean, default: false },
		is_sale_cosrx: { type: Boolean, default: false },
		is_flashsale: { type: Boolean, default: false },
		is_pre_order: { type: Boolean, default: false },
		is_pre_order_lilla: { type: Boolean, default: false },
		is_pre_order_sociolla_vn: { type: Boolean, default: false },
		tactical_promo_type: { type: String, enum: ['sociolla_sale', 'sociolla_deals'] },
		is_featured_tracking_promo: { type: Boolean, default: false }, // for tracking featured products in tactical promo
		is_deleted: { type: Boolean, default: false },
		/** for admin approval of product added by customer  */
		status: {
			type: String,
			default: 'waiting-approval',
			enum: ['approved', 'waiting-approval', 'rejected'],
		},
		inactive_state: {
			type: String,
			enum: ['no', 'temporary', 'permanent'],
		},

		/** product active in which platform */
		is_active_in_review: { type: Boolean, default: false },
		is_active_in_sociolla: { type: Boolean, default: false },
		enabled_at_sociolla: { type: Date, default: Date.now }, // latest enabled date for default sort
		is_active_in_lulla: { type: Boolean, default: false },
		is_active_in_offline_store: { type: Boolean, default: false },
		is_active_in_event_microsite: { type: Boolean, default: false },
		is_active_in_event_microsite_vn: { type: Boolean, default: false },
		is_active_in_sociolla_vn: { type: Boolean, default: false },
		is_active_in_review_vn: { type: Boolean, default: false },
		is_active_in_lulla_vn: { type: Boolean, default: false },
		is_active_in_offline_store_vn: { type: Boolean, default: false },
		is_active_in_offline_store_lilla: { type: Boolean, default: false },
		is_active_in_carasun: { type: Boolean, default: false },
		is_active_in_cosrx: { type: Boolean, default: false },
		is_active_in_b2b: { type: Boolean, default: false },
		is_limited: { type: Boolean, default: false },
		is_exclusive: { type: Boolean, default: false },
		is_online: { type: Boolean, default: false },
		is_disable_in_apps: { type: Boolean, default: false },
		is_organic_product: { type: Boolean, default: false },

		is_kill_product: { type: Boolean, default: false },

		/** availability of product for pickup at offline stores to enable omnichannel */
		pick_up_at_stores: [StoreSchema],

		is_product_testing: { type: Boolean, default: false },
		is_dangerous: { type: Boolean, default: false },
		is_liquid: { type: Boolean, default: false },
		condition: { type: String, enum: ['new', 'used', 'refurbished'] },
		purchase_type: { type: String, enum: ['direct_purchase', 'consignment'] },
		bpom_reg_no: String,
		margin: Number,
		total_orders: { type: Number, default: 0 },
		total_store_orders: { type: Number, default: 0 },
		total_wishlist: { type: Number, default: 0 }, // total wishlisted product by customer

		/** to set as highlighted product */
		is_featured: Boolean,
		/** to set for Our Picks section */
		is_our_pick: {
			is_active: { type: Boolean },
			created_at: Date,
		},
		/** to set for what's new section **/
		is_whats_new: {
			is_active: { type: Boolean },
			is_active_in_sociolla: { type: Boolean },
			is_active_in_lulla: { type: Boolean },
			is_active_in_sociolla_vn: { type: Boolean, default: false },
			is_active_in_carasun: { type: Boolean, default: false },
			is_active_in_cosrx: { type: Boolean, default: false },
			created_at: Date,
		},
		is_bundle_pack: {
			is_active: { type: Boolean },
			is_active_in_sociolla: { type: Boolean },
			is_active_in_lulla: { type: Boolean },
			is_active_in_sociolla_vn: { type: Boolean, default: false },
			is_active_in_carasun: { type: Boolean, default: false },
			is_active_in_cosrx: { type: Boolean, default: false },
			created_at: Date,
		},
		/** to set for brand page most popular, and for default sort on product list */
		is_most_popular: { type: Boolean, default: false },
		/** to set as event ticket eg. bff run, customer cannot combine other product with this in same order */
		is_product_ticket: { type: Boolean, default: false },
		/** to set as ture when the event is organized in soco platform */
		is_soco_event: { type: Boolean, default: false },
		/** if true, normal voucher cannot be applied, only is_super_product voucher can be applied */
		is_non_discounted: { type: Boolean, default: false },
		classification: {
			type: String,
			enum: [
				'sellable_products', // ordinary product
				'gwp_non_sellable', // gift with purchase
				'bundle_virtual', // virtual bundle pack product
				'bundle_non_sellable', // curated mask boxes
				'bundle_physical', // physical bundle
				'egift', // egift,
				'mask_packages', // mask subscription packages
				'paper_bag',
				'testers',
			],
		},
		/** hide products in the pack on detail page */
		hide_pack_content: { type: Boolean, default: false },

		/* used for classification: mask_packages  */
		curated_mask_boxes: [
			{
				id: Number, // product id of classification: bundle_non_sellable
			},
		],

		/* details of products in the pack */
		pack_detail: [
			{
				_id: false,
				id: Number,
				name: String,
				classification: {
					type: String,
					enum: [
						'sellable_products', // ordinary product
						'gwp_non_sellable', // gift with purchase
						'bundle_virtual', // virtual bundle pack product
						'bundle_non_sellable', // curated mask boxes
						'bundle_physical', // physical bundle
						'egift', // egift,
						'mask_packages', // mask subscription packages
						'testers',
					],
				},
				description: String,
				is_active_in_sociolla: { type: Boolean, default: false },
				is_active_in_sociolla_vn: { type: Boolean, default: false },
				is_active_in_event_microsite: { type: Boolean, default: false },
				is_active_in_event_microsite_vn: { type: Boolean, default: false },
				is_active_in_lulla: { type: Boolean, default: false },
				is_active_in_carasun: { type: Boolean, default: false },
				is_active_in_cosrx: { type: Boolean, default: false },
				is_out_of_stock_sociolla: { type: Boolean, default: false },
				is_out_of_stock_lilla: { type: Boolean, default: false },
				is_out_of_stock_sociolla_vn: { type: Boolean, default: false },
				is_out_of_stock_carasun: { type: Boolean, default: false },
				is_out_of_stock_cosrx: { type: Boolean, default: false },
				brand: {
					id: { type: Schema.Types.ObjectId, ref: 'brands' },
					name: String,
					slug: String,
					logo: String,
					region: String,
					country: String,
					country_tag_id: Number, // tags.soco_id for slug brand origins page
					flag: String,
					i18n: {
						vi: {
							country: String,
						},
					},
				},
				images: [ImageSchema], // 1 cover image
				i18n: {
					vi: {
						name: { type: String, trim: true },
						description: String,
						short_description: String,
						how_to_use: String,
						ingredients: String,
						images: [ImageSchema], // 1 cover image
						review_stats: {
							total_reviews: { type: Number, default: 0 },
							average_rating: { type: Number, default: 0 },
							average_rating_by_types: { type: Object, default: {} },
							total_recommended_count: { type: Number, default: 0 },
							total_repurchase_maybe_count: { type: Number, default: 0 },
							total_repurchase_no_count: { type: Number, default: 0 },
							total_repurchase_yes_count: { type: Number, default: 0 },
						},
					},
				},
				combinations: [
					{
						id: Schema.Types.ObjectId,
						my_soco_sql_id: Number,
						my_sociolla_sql_id: Number,
						is_default: Boolean,
						attributes: {
							size: AttributeSchema,
							shade: AttributeSchema,
							variant: AttributeSchema,
							non_specify: AttributeSchema,
						},
						images: [ImageSchema],
						video_url: String,
						ean_no: String,
						product_number: String,
						reference: String,
						price: Number,
						stock: { type: Number, default: 0 },
						safety_stock: Number,
						max_limit_per_order: Number,
						is_active_in_review: { type: Boolean, default: false },
						is_active_in_sociolla: { type: Boolean, default: false },
						is_active_in_event_microsite: { type: Boolean, default: false },
						is_active_in_event_microsite_vn: { type: Boolean, default: false },
						is_active_in_lulla: { type: Boolean, default: false },
						is_active_in_sociolla_vn: { type: Boolean, default: false },
						is_active_in_offline_store: { type: Boolean, default: false },
						is_active_in_carasun: { type: Boolean, default: false },
						is_active_in_cosrx: { type: Boolean, default: false },
						is_deleted: { type: Boolean, default: false },
						is_limited: { type: Boolean, default: false },
						is_exclusive: { type: Boolean, default: false },
						visibility: { type: String, enum: ['Everywhere', 'Nowhere'], default: 'Nowhere' },
						is_out_of_stock_sociolla: { type: Boolean, default: false },
						is_out_of_stock_lulla: { type: Boolean, default: false },
						is_out_of_stock_carasun: { type: Boolean, default: false },
						is_out_of_stock_cosrx: { type: Boolean, default: false },
						is_out_of_stock_sociolla_vn: { type: Boolean, default: false },
						i18n: {
							// internationalization
							vi: {
								price: Number,
								video_url: String,
								warehouse_location: String,
								total_masks: Number,
								stock: { type: Number, default: 0 },
								safety_stock: Number,
								meta_keyword: String,
								product_number: String,
								max_limit_per_order: Number,
								images: [ImageSchema],
								ean_no: String,
								reference: String,
							},
						},
					},
				], // chosen combinations
				quantity: { type: Number, default: 1 }, // quantity of product inside pack
				review_stats: {
					total_reviews: { type: Number, default: 0 },
					average_rating: { type: Number, default: 0 },
					average_rating_by_types: { type: Object, default: {} },
					total_recommended_count: { type: Number, default: 0 },
					total_repurchase_maybe_count: { type: Number, default: 0 },
					total_repurchase_no_count: { type: Number, default: 0 },
					total_repurchase_yes_count: { type: Number, default: 0 },
				},
				is_deleted: { type: Boolean, default: false },
				short_description: String,
				how_to_use: String,
				ingredients: String,
				default_category: {
					id: { type: Schema.Types.ObjectId, ref: 'categories' },
					name: String,
					slug: String,
					my_soco_sql_id: Number,
					rating_types: [String],
				},
				slug: String,
			},
		],

		/* mask details */
		curated_plans: [
			{
				// stores plan info for (classification: bundle_non_sellable) only
				id: Number,
				name: String, // plan name
			},
		],
		has_free_products: { type: Boolean, default: false }, // specifies if Subscription plan offers free product or not
		plan_logo_url: String, //for subscription plans
		background_image_url: String, // for subscription plans
		ranking: Number, // helps to sort subscription plans
		plan_ranking: Number, // helps to sort curated boxes
		is_mask: { type: Boolean, default: false },
		mask_detail: {
			tier1: {
				limit: Number,
				products: [
					{
						id: Number,
						combination_id: Schema.Types.ObjectId,
					},
				],
			},
			tier2: {
				limit: Number,
				products: [
					{
						id: Number,
						combination_id: Schema.Types.ObjectId,
					},
				],
			},
			tier3: {
				limit: Number,
				products: [
					{
						id: Number,
						combination_id: Schema.Types.ObjectId,
					},
				],
			},
		},
		/** TODO, buy one get one rules */
		bogo_rules: [
			{
				name: String,
				voucher_id: Schema.Types.ObjectId,
				id: Number, // product id
				combination_id: Schema.Types.ObjectId,
				quantity: { type: Number, default: 0 },
				stock: { type: Number, default: 0 },
				from: Date,
				to: Date,
				apply_discount_for: [
					{
						type: String,
						enum: [
							'offline_store',
							'ios',
							'android',
							'sociolla',
							'lulla',
							'lulla_ios',
							'lulla_android',
							'sociolla_vn',
							'sociolla_vn_android',
							'sociolla_vn_ios',
							'offline_store_vn',
							'carasun',
							'cosrx',
							'sociolla_store',
						],
					},
				],
			},
		],
		//for pink university game
		is_pink_university_game: {
			is_active: { type: Boolean, default: false },
			url: String,
			play_url: String,
			points: Number,
		},
		/** active discounts applicable on this product through product/brand/category rules */
		discounts: [DiscountSchema],
		preorder: [PreorderSchema],

		brand: {
			id: { type: Schema.Types.ObjectId, ref: 'brands' },
			name: String,
			name_latin: String,
			slug: String,
			my_soco_sql_id: Number,
			my_sociolla_sql_id: Number,
			logo: String,
			is_active_in_lulla: Boolean,
			is_active_in_sociolla: Boolean,
			is_active_in_sociolla_vn: Boolean,
			is_active_in_carasun: Boolean,
			is_active_in_cosrx: Boolean,
			is_active_in_review: Boolean,
			region: String,
			country: String,
			country_tag_id: Number, // tags.soco_id for slug brand origins page
			flag: String,
			i18n: {
				vi: {
					country: String,
				},
			},
			is_active_in_event_microsite: Boolean,
			is_active_in_event_microsite_vn: Boolean,
		},
		sbd_categories: [CategorySchema], //shop_by_departement categories (keep max 3)
		categories: [CategorySchema],
		odoo_category: {
			id: Schema.Types.ObjectId,
			name: String,
		},
		/** default category used for rating product in review */
		default_category: {
			id: { type: Schema.Types.ObjectId, ref: 'categories' },
			name: String,
			slug: String,
			my_soco_sql_id: Number,
			rating_types: [String],
		},

		/** parent_category is root of parent category, this different with default category  */
		parent_category: {
			id: { type: Schema.Types.ObjectId, ref: 'categories' },
			name: String,
			slug: String,
			link_rewrite: String,
			my_soco_sql_id: Number,
		},

		/** product combinations, atleast one is compulsory (default with non_specify attribute), first one treated as default combination */
		combinations: [CombinationSchema],
		default_combination: CombinationSchema,

		/** aggregated review data */
		review_stats: {
			total_reviews: { type: Number, default: 0 },
			average_rating: { type: Number, default: 0 },
			/** rating types based on product's default category */
			average_rating_by_types: { type: Object, default: {} },
			total_recommended_count: { type: Number, default: 0 },
			total_repurchase_maybe_count: { type: Number, default: 0 },
			total_repurchase_no_count: { type: Number, default: 0 },
			total_repurchase_yes_count: { type: Number, default: 0 },
		},

		/** used for award */
		awards: [
			{
				name: String,
				image: String,
				title: String,
				description: String,
				year: { type: Number, default: 0 },
			},
		],

		/** used for recommendation using beauty profile */
		tags: [
			{
				_id: false,
				id: { type: Schema.Types.ObjectId, ref: 'tags' },
				my_soco_sql_id: Number,
				name: String,
				level_name: String,
				is_campaign: { type: Boolean },
			},
		],
		added_by_user: Schema.Types.ObjectId,
		user_contribution: {
			is_user_contribution: { type: Boolean, default: false },
			user_id: { type: Schema.Types.ObjectId, default: null },
			user_name: { type: String },
		},
		/** to identify if any combination is marked is_priority (offline) */
		is_priority: {
			type: Boolean,
			default: false,
		},
		platforms: [{ type: String, enum: ['sociolla', 'sociolla_vn', 'lulla', 'carasun', 'cosrx'] }],
		two_days_total_views: { type: Number },
		is_out_of_stock_sociolla: { type: Boolean, default: false },
		is_out_of_stock_lilla: { type: Boolean, default: false },
		is_out_of_stock_carasun: { type: Boolean, default: false },
		is_out_of_stock_cosrx: { type: Boolean, default: false },
		is_out_of_stock_sociolla_vn: { type: Boolean, default: false },
		is_in_stock_sociolla: { type: Boolean, default: true },
		is_in_stock_lulla: { type: Boolean, default: true },
		is_in_stock_sociolla_vn: { type: Boolean, default: true },
		is_in_stock_carasun: { type: Boolean, default: true },
		is_in_stock_cosrx: { type: Boolean, default: true },
		active_for_sociolla_at: Date, // set date to mark new arival
		active_for_sociolla_vn_at: Date, // set date to mark new arival
		active_for_lilla_at: Date, // set date to mark new arival
		is_internal_brand_lulla: {
			type: Boolean,
			default: false,
		},
		is_internal_brand_sociolla: {
			type: Boolean,
			default: false,
		},
		is_internal_brand_sociolla_vn: {
			type: Boolean,
			default: false,
		},
		is_internal_brand_carasun: { type: Boolean, default: false },
		is_internal_brand_cosrx: { type: Boolean, default: false },
		two_days_total_orders: { type: Number },
		just_arrived: { type: Boolean, default: false },
		position: { type: Number, default: 0 },
		seven_days_total_orders: { type: Number, default: 0 },
		thirty_days_total_orders: { type: Number, default: 0 },
		//show_combination_product_grid : { type: Boolean, default: false },
		is_discontinue: { type: Boolean, default: false },
		created_by: Schema.Types.ObjectId,
		updated_by: Schema.Types.ObjectId,
		frame_rules: [
			{
				id: { type: Schema.Types.ObjectId, ref: 'frame_rules' },
				is_active: { type: Boolean },
				combination_ids: [Schema.Types.ObjectId],
				image: String,
				start_date: Date,
				end_date: Date,
				applicable_for: [
					{
						type: String,
						enum: [
							'all',
							'sociolla',
							'ios',
							'android',
							'sociolla_vn',
							'sociolla_vn_android',
							'sociolla_vn_ios',
						],
					},
				],
				created_at: Date,
			},
		],
		bpom_expired_at: Date,
		is_for_moms: { type: Boolean, default: false },
		is_for_baby_kids: { type: Boolean, default: false },
		is_red_carpet: { type: Boolean, default: false },
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		collation: {
			locale: 'en',
			strength: 1,
		},
	},
);

const preSaveHook = async function (next) {
	const doc = this;
	if (!doc.name && doc.i18n && Object.keys(doc.i18n).length > 0) {
		doc.name = doc.i18n[Object.keys(doc.i18n)[0]].name; // when creating NOT from ID, we'll insert name from locale
	} else if (doc.name && ProductSchema.obj.i18n && Object.keys(ProductSchema.obj.i18n).length > 0) {
		Object.keys(ProductSchema.obj.i18n).forEach((locale) => {
			if (ProductSchema.obj.i18n[locale].name && !doc.i18n[locale].name) {
				doc.i18n[locale].name = doc.name; // if creating from ID, then we'll insert name to each locale
			}
		});
	}

	// set name_latin
	if (doc.i18n && doc.i18n.vi && doc.i18n.vi.name) {
		doc.i18n.vi.name_latin = vnToLatin(doc.i18n.vi.name);
		doc.brand.name_latin = vnToLatin(doc.brand.name);
	}

	return next();
};

const preUpdateHook = function (next) {
	const query = this._update;
	// set name_latin
	if (query.i18n && query.i18n.vi && query.i18n.vi.name) {
		query.i18n.vi.name_latin = vnToLatin(query.i18n.vi.name);
		query.brand.name_latin = vnToLatin(query.brand.name);
	}

	return next();
};

ProductSchema.plugin(autoIncrement.plugin, { model: 'products', field: 'id' });
ProductSchema.plugin(autoIncrement.plugin, { model: 'products', field: 'my_sociolla_sql_id' });

ProductSchema.pre('save', preSaveHook);
ProductSchema.pre('updateOne', preUpdateHook);
ProductSchema.pre('findOneAndUpdate', preUpdateHook);

module.exports = mongoose.model('products', ProductSchema);
