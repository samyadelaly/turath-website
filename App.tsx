import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductItem, InquiryFormData, ProductCategoryInfo } from './types';
import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from './initialCatalog';
import { getStoredProducts, saveStoredProducts, resetStoredProducts, loadProductsFromIndexedDB } from './storage';
import { 
  getStoredCategories, 
  saveCategoryCover, 
  resetSingleCategoryCover, 
  resetCategoryCovers,
  saveCategory,
  deleteCategory
} from './categoryStorage';
import { 
  getStoredSiteContent, 
  saveStoredSiteContent, 
  resetStoredSiteContent, 
  SiteContent 
} from './siteContentStorage';
import { isAdminLoggedIn, setAdminLoggedIn } from './adminAuth';
import { 
  subscribeToCloudLogo,
  subscribeToCloudCategoryCovers,
  saveCloudCategoryCover,
  resetCloudCategoryCover,
  subscribeToCloudProducts,
  saveCloudProduct,
  deleteCloudProduct,
  resetCloudProducts,
  subscribeToCloudSiteContent,
  saveCloudSiteContent,
  resetCloudSiteContent,
  subscribeToCloudCategories,
  saveCloudCategory,
  deleteCloudCategory
} from './cloudDatabase';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { CustomManufacturingSection } from './CustomManufacturingSection';
import { WhyChooseUsSection } from './WhyChooseUsSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { ProductCategoryView } from './ProductCategoryView';
import { AllProductsView } from './AllProductsView';
import { ProductDetailPage } from './ProductDetailPage';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductEditorModal } from './ProductEditorModal';
import { ChangeLogoModal } from './ChangeLogoModal';
import { EditCategoryCoverModal } from './EditCategoryCoverModal';
import { SiteContentEditorModal } from './SiteContentEditorModal';
import { CategoryManagerModal } from './CategoryManagerModal';
import { AdminLoginModal } from './AdminLoginModal';
import { DownloadZipModal } from './DownloadZipModal';
import { AdminBar } from './AdminBar';
import { TiltCard } from './TiltCard';
import { Sparkles, ArrowRight, PlusCircle, Image as ImageIcon, Camera, Layers, FileText } from 'lucide-react';

export function App() {
  const [products, setProducts] = useState<ProductItem[]>(() => getStoredProducts());
  const [categories, setCategories] = useState<ProductCategoryInfo[]>(() => getStoredCategories());
  const [siteContent, setSiteContent] = useState<SiteContent>(() => getStoredSiteContent());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminLoggedIn());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isDownloadZipModalOpen, setIsDownloadZipModalOpen] = useState<boolean>(false);
  const [isSiteContentEditorOpen, setIsSiteContentEditorOpen] = useState<boolean>(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState<boolean>(false);

  // Real-time synchronization of categories, products, logo and admin status with Cloud Database
  useEffect(() => {
    // 1. Subscribe to Cloud Logo changes across all sessions
    const unsubLogo = subscribeToCloudLogo((newLogo) => {
      // Handled via window event in TurathLogo component
    });

    // 2. Subscribe to Cloud Category Covers changes
    const unsubCovers = subscribeToCloudCategoryCovers((coversMap) => {
      setCategories((prev) =>
        prev.map((cat) => {
          if (coversMap[cat.id]) {
            return { ...cat, coverImage: coversMap[cat.id] };
          }
          return cat;
        })
      );
    });

    // 3. Subscribe to Cloud Products Catalog
    const unsubProducts = subscribeToCloudProducts((cloudProducts) => {
      if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    // Hydrate from IndexedDB on initial mount if available
    loadProductsFromIndexedDB().then((idbProducts) => {
      if (Array.isArray(idbProducts) && idbProducts.length > 0) {
        setProducts(idbProducts);
      }
    });

    // 4. Subscribe to Cloud Site Content (texts & headlines)
    const unsubContent = subscribeToCloudSiteContent((cloudContent) => {
      if (cloudContent) {
        setSiteContent(cloudContent);
      }
    });

    // 5. Subscribe to Cloud Categories (dynamic categories)
    const unsubCategories = subscribeToCloudCategories((cloudCats) => {
      if (Array.isArray(cloudCats) && cloudCats.length > 0) {
        setCategories(cloudCats);
      }
    });

    const handleCategoriesUpdate = (event?: Event) => {
      const customEv = event as CustomEvent;
      if (customEv?.detail?.categories && Array.isArray(customEv.detail.categories) && customEv.detail.categories.length > 0) {
        setCategories(customEv.detail.categories);
      } else {
        setCategories(getStoredCategories());
      }
    };
    const handleSiteContentUpdate = () => {
      setSiteContent(getStoredSiteContent());
    };
    const handleAdminAuthChange = () => {
      setIsAdmin(isAdminLoggedIn());
    };

    window.addEventListener('turath-categories-updated', handleCategoriesUpdate);
    window.addEventListener('turath-site-content-updated', handleSiteContentUpdate);
    window.addEventListener('turath-admin-auth-changed', handleAdminAuthChange);

    return () => {
      unsubLogo();
      unsubCovers();
      unsubProducts();
      unsubContent();
      unsubCategories();
      window.removeEventListener('turath-categories-updated', handleCategoriesUpdate);
      window.removeEventListener('turath-site-content-updated', handleSiteContentUpdate);
      window.removeEventListener('turath-admin-auth-changed', handleAdminAuthChange);
    };
  }, []);

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    setIsAdmin(false);
    setIsEditorOpen(false);
    setIsEditCoverModalOpen(false);
    setIsLogoModalOpen(false);
    setIsSiteContentEditorOpen(false);
    setIsCategoryManagerOpen(false);
  };

  const handleSaveSiteContent = async (newContent: SiteContent) => {
    saveStoredSiteContent(newContent);
    setSiteContent(newContent);
    try {
      await saveCloudSiteContent(newContent);
    } catch (err) {
      console.warn('Could not sync site content to cloud immediately:', err);
    }
  };

  const handleResetSiteContent = async () => {
    const refreshed = resetStoredSiteContent();
    setSiteContent(refreshed);
    try {
      await resetCloudSiteContent();
    } catch (err) {
      console.warn('Could not reset site content in cloud immediately:', err);
    }
  };

  const handleSaveCategory = async (cat: ProductCategoryInfo) => {
    const updated = saveCategory(cat);
    setCategories(updated);
    try {
      await saveCloudCategory(cat);
    } catch (err) {
      console.warn('Could not sync category to cloud immediately:', err);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const updated = deleteCategory(categoryId);
    setCategories(updated);
    try {
      await deleteCloudCategory(categoryId);
    } catch (err) {
      console.warn('Could not delete category from cloud immediately:', err);
    }
  };

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [activeProductPage, setActiveProductPage] = useState<ProductItem | null>(null);

  // Active product modals
  const [activeProductDetail, setActiveProductDetail] = useState<ProductItem | null>(null);
  const [productDetailInitialShowVideo, setProductDetailInitialShowVideo] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorInitialCategory, setEditorInitialCategory] = useState<string | undefined>(undefined);
  const [editingProduct, setEditingProduct] = useState<ProductItem | undefined>(undefined);

  // Category cover editor modal
  const [isEditCoverModalOpen, setIsEditCoverModalOpen] = useState<boolean>(false);
  const [selectedCategoryForCover, setSelectedCategoryForCover] = useState<string | null>(null);

  const handleOpenEditCoverModal = (categoryId?: string) => {
    setSelectedCategoryForCover(categoryId || null);
    setIsEditCoverModalOpen(true);
  };

  const handleSaveCategoryCover = async (categoryId: string, newCoverUrl: string) => {
    const updated = saveCategoryCover(categoryId, newCoverUrl);
    setCategories(updated);
    try {
      await saveCloudCategoryCover(categoryId, newCoverUrl);
    } catch (err) {
      console.warn('Could not sync category cover to cloud immediately:', err);
    }
  };

  const handleResetCategoryCover = async (categoryId: string) => {
    const updated = resetSingleCategoryCover(categoryId);
    setCategories(updated);
    try {
      await resetCloudCategoryCover(categoryId);
    } catch (err) {
      console.warn('Could not reset category cover in cloud immediately:', err);
    }
  };

  const handleOpenProductDetail = (prod: ProductItem, openWithVideo: boolean = false) => {
    setActiveProductDetail(prod);
    setProductDetailInitialShowVideo(openWithVideo);
  };

  // Logo replacement modal
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

  // Inquiries prefill
  const [inquiryPreFill, setInquiryPreFill] = useState<Partial<InquiryFormData>>({});

  // Sync products safely to local storage as cache
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  const handleSaveProduct = async (product: ProductItem) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });

    setActiveProductPage((current) => (current && current.id === product.id ? product : current));
    setActiveProductDetail((current) => (current && current.id === product.id ? product : current));

    try {
      await saveCloudProduct(product);
    } catch (err) {
      console.error('Could not save product to cloud Firestore:', err);
      throw err;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setActiveProductPage((current) => (current && current.id === productId ? null : current));
    setActiveProductDetail((current) => (current && current.id === productId ? null : current));
    try {
      await deleteCloudProduct(productId);
    } catch (err) {
      console.warn('Could not delete product from cloud immediately:', err);
    }
  };

  const handleResetCatalog = async () => {
    const refreshed = resetStoredProducts();
    setProducts(refreshed);
    try {
      await resetCloudProducts();
    } catch (err) {
      console.warn('Could not reset catalog in cloud immediately:', err);
    }
  };

  const navigateToProduct = (product: ProductItem) => {
    setActiveProductPage(product);
    setSelectedCategoryId(product.categoryId);
    setCurrentView('product-detail');
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(
        { productId: product.id },
        '',
        `/products/${product.categoryId}/${product.seoSlug || product.id}`
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser URL Synchronization & Deep Linking
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);

      if (parts[0] === 'products') {
        if (parts.length >= 3) {
          const catId = parts[1];
          const slug = parts[2];
          const matched =
            products.find(
              (p) =>
                (p.seoSlug === slug || p.id === slug || p.sku === slug) &&
                (p.categoryId === catId || !catId)
            ) || products.find((p) => p.seoSlug === slug || p.id === slug || p.sku === slug);

          if (matched) {
            setActiveProductPage(matched);
            setSelectedCategoryId(matched.categoryId);
            setCurrentView('product-detail');
            return;
          }
        } else if (parts.length === 2) {
          setSelectedCategoryId(parts[1]);
          setCurrentView('category');
          return;
        } else {
          setCurrentView('products');
          return;
        }
      } else if (parts[0] === 'about') {
        setCurrentView('about');
        return;
      } else if (parts[0] === 'custom') {
        setCurrentView('custom');
        return;
      } else if (parts[0] === 'contact') {
        setCurrentView('contact');
        return;
      } else if (parts[0] === 'why-us') {
        setCurrentView('why-us');
        return;
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [products]);

  const navigateTo = (view: string, categoryId?: string | null) => {
    setCurrentView(view);
    if (categoryId) {
      setSelectedCategoryId(categoryId);
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', `/products/${categoryId}`);
      }
    } else if (view === 'home') {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', '/');
      }
    } else if (view === 'products') {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', '/products');
      }
    } else {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', `/${view}`);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditor = (categoryId?: string, product?: ProductItem) => {
    setEditorInitialCategory(categoryId);
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleSelectProductForInquiry = (product: ProductItem) => {
    setInquiryPreFill({
      productName: product.name,
      productCategory: categories.find((c) => c.id === product.categoryId)?.name || '',
      notes: `I am inquiring regarding the "${product.name}" (${product.dimensions}) in finish options: ${product.finishOptions.join(', ')}. Please provide quotation and availability.`,
    });
    navigateTo('contact');
    setTimeout(() => {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f0e6] flex flex-col font-sans selection:bg-[#d4c59d] selection:text-[#000000]">
      {/* Admin Quick Action Bar when logged in */}
      {isAdmin && (
        <AdminBar
          onOpenEditCategoryCovers={() => handleOpenEditCoverModal()}
          onOpenProductEditor={() => openEditor()}
          onOpenChangeLogo={() => setIsLogoModalOpen(true)}
          onOpenDownloadZip={() => setIsDownloadZipModalOpen(true)}
          onOpenSiteContentEditor={() => setIsSiteContentEditorOpen(true)}
          onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Universal Navigation */}
      <Navbar
        currentView={currentView}
        selectedCategory={selectedCategoryId}
        onNavigate={navigateTo}
        onOpenProductEditor={() => openEditor()}
        onOpenChangeLogo={() => setIsLogoModalOpen(true)}
        onOpenEditCategoryCovers={() => handleOpenEditCoverModal()}
        onOpenDownloadZip={() => setIsDownloadZipModalOpen(true)}
        categories={categories}
        content={siteContent}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'product-detail' && activeProductPage ? (
            <motion.div
              key={`product-${activeProductPage.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductDetailPage
                product={activeProductPage}
                allProducts={products}
                categories={categories}
                onSelectProduct={(p) => navigateToProduct(p)}
                onBack={() => navigateTo('category', activeProductPage.categoryId)}
                onSelectCategory={(catId) => navigateTo('category', catId)}
                onSelectForInquiry={handleSelectProductForInquiry}
                onEditProduct={(p) => openEditor(p.categoryId, p)}
                isAdmin={isAdmin}
              />
            </motion.div>
          ) : currentView === 'products' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AllProductsView
                products={products}
                categories={categories}
                onSelectCategory={(catId) => navigateTo('category', catId)}
                onSelectProduct={(prod) => handleOpenProductDetail(prod)}
                onOpenAddProduct={(catId) => openEditor(catId)}
                onOpenEditCoverModal={(catId) => handleOpenEditCoverModal(catId)}
                onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
                isAdmin={isAdmin}
              />
            </motion.div>
          ) : currentView === 'category' && activeCategory ? (
            <motion.div
              key={`category-${activeCategory.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCategoryView
                category={activeCategory}
                products={products}
                categories={categories}
                onSelectProduct={(prod, openWithVideo) => handleOpenProductDetail(prod, openWithVideo)}
                onOpenAddProduct={(catId) => openEditor(catId)}
                onSelectCategory={(catId) => navigateTo('category', catId)}
                onNavigateHome={() => navigateTo('home')}
                onOpenEditCover={(catId) => handleOpenEditCoverModal(catId)}
                isAdmin={isAdmin}
              />
            </motion.div>
          ) : currentView === 'about' ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="py-8"
            >
              <AboutSection content={siteContent} />
            </motion.div>
          ) : currentView === 'custom' ? (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="py-8"
            >
              <CustomManufacturingSection
                onStartCustomProject={() => {
                  setInquiryPreFill({
                    notes: 'Custom Manufacturing Request: I have a custom design idea/dimensions for fabrication.',
                  });
                  navigateTo('contact');
                }}
              />
            </motion.div>
          ) : currentView === 'why-us' ? (
            <motion.div
              key="why-us"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="py-8"
            >
              <WhyChooseUsSection content={siteContent} />
            </motion.div>
          ) : currentView === 'contact' ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="py-8"
            >
              <ContactSection initialData={inquiryPreFill} content={siteContent} />
            </motion.div>
          ) : (
            /* HOME VIEW */
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <HeroSection
                onExploreProducts={() => navigateTo('products')}
                onCustomQuote={() => navigateTo('custom')}
                onOpenChangeLogo={() => setIsLogoModalOpen(true)}
                content={siteContent}
                isAdmin={isAdmin}
              />

              {/* Featured Product Collections (Categories Overview) */}
              <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-b border-[#d4c59d]/30">
                <div className="max-w-7xl mx-auto space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000000] border border-[#d4c59d] text-xs font-semibold uppercase tracking-wider text-[#d4c59d]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>The Complete Egyptian Collection</span>
                      </div>

                      <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6]">
                        Our Handcrafted Products
                      </h2>

                      <p className="text-xs sm:text-sm text-[#9e9174] max-w-2xl">
                        Select any category below to browse photos, watch crafting videos, and request custom specifications.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Admin-only direct cover & product editing CTA */}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => setIsCategoryManagerOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all shadow font-arabic"
                            title="إدارة وإضافة وحذف أقسام المنتجات"
                          >
                            <Layers className="w-4 h-4" />
                            <span>إدارة الأقسام (Categories)</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditCoverModal()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all shadow"
                            title="Change cover photos of the handcrafted categories"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>تعديل صور الأقسام (Edit Covers)</span>
                          </button>

                          <button
                            onClick={() => openEditor()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add / Edit Products</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => navigateTo('products')}
                        className="gold-shimmer-hover inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow cursor-pointer"
                      >
                        <span>View All {categories.length} Categories</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Categories Visual Grid with 3D Tilt & Sheen */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.categoryId === cat.id).length;
                      return (
                        <TiltCard
                          key={cat.id}
                          onClick={() => navigateTo('category', cat.id)}
                          className="group bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] rounded-xl overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between"
                        >
                          <div className="relative aspect-[16/11] overflow-hidden bg-[#000000]">
                            <img
                              src={cat.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'}
                              alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                            />
                            <span className="absolute top-2.5 right-2.5 text-[11px] font-arabic font-bold bg-[#d4c59d] text-[#000000] px-2 py-0.5 rounded shadow">
                              {cat.nameArabic}
                            </span>

                            {/* Direct Change Cover Button on each card - Admin Only */}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditCoverModal(cat.id);
                                }}
                                className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/60 text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg z-10"
                                title="Edit this category cover photo"
                              >
                                <Camera className="w-3 h-3" />
                                <span>تعديل الغلاف</span>
                              </button>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-serif-luxury text-base font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                                {cat.name}
                              </h3>
                              <span className="text-[10px] text-[#000000] font-bold bg-[#d4c59d] px-2 py-0.5 rounded">
                                {count} items
                              </span>
                            </div>
                            <p className="text-[11px] text-[#9e9174] line-clamp-2">
                              {cat.shortDesc}
                            </p>
                            <div className="pt-2 flex items-center justify-between text-xs text-[#d4c59d] font-semibold group-hover:translate-x-1 transition-transform">
                              <span>Browse category</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </TiltCard>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* About Section */}
              <AboutSection content={siteContent} />

            {/* Custom Manufacturing */}
            <CustomManufacturingSection
              onStartCustomProject={() => {
                setInquiryPreFill({
                  notes: 'Custom Manufacturing Request: I have a custom design idea/dimensions for fabrication.',
                });
                navigateTo('contact');
              }}
            />

            {/* Why Choose Turath */}
            <WhyChooseUsSection content={siteContent} />

            {/* Contact Section & Form */}
            <ContactSection initialData={inquiryPreFill} content={siteContent} />
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenProductEditor={() => openEditor()}
        onOpenChangeLogo={() => setIsLogoModalOpen(true)}
        onOpenEditCategoryCovers={() => handleOpenEditCoverModal()}
        onOpenDownloadZip={() => setIsDownloadZipModalOpen(true)}
        onOpenSiteContentEditor={() => setIsSiteContentEditorOpen(true)}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        categories={categories}
        content={siteContent}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Product Detail Modal (Photos & Video Player) */}
      {activeProductDetail && (
        <ProductDetailModal
          product={activeProductDetail}
          initialShowVideo={productDetailInitialShowVideo}
          onClose={() => setActiveProductDetail(null)}
          onSelectForInquiry={handleSelectProductForInquiry}
          onEditProduct={(p) => openEditor(p.categoryId, p)}
          onOpenFullPage={(p) => navigateToProduct(p)}
          isAdmin={isAdmin}
        />
      )}

      {/* Product Editor Modal (Add/Edit Photos and Videos) */}
      {isEditorOpen && (
        <ProductEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetCatalog={handleResetCatalog}
          initialCategoryId={editorInitialCategory}
          editProduct={editingProduct}
          categories={categories}
        />
      )}

      {/* Change / Replace Logo Modal */}
      {isLogoModalOpen && (
        <ChangeLogoModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
          onLogoUpdated={() => {
            // Event fires and updates logo everywhere
          }}
        />
      )}

      {/* Edit Category Cover Photos Modal */}
      {isEditCoverModalOpen && (
        <EditCategoryCoverModal
          isOpen={isEditCoverModalOpen}
          onClose={() => setIsEditCoverModalOpen(false)}
          categories={categories}
          initialCategoryId={selectedCategoryForCover}
          onSaveCover={handleSaveCategoryCover}
          onResetCover={handleResetCategoryCover}
        />
      )}

      {/* Site Content Editor Modal (All Texts & Headlines) */}
      {isSiteContentEditorOpen && (
        <SiteContentEditorModal
          isOpen={isSiteContentEditorOpen}
          onClose={() => setIsSiteContentEditorOpen(false)}
          currentContent={siteContent}
          onSaveContent={handleSaveSiteContent}
          onResetContent={handleResetSiteContent}
        />
      )}

      {/* Category Manager Modal (Add / Edit / Remove Product Categories) */}
      {isCategoryManagerOpen && (
        <CategoryManagerModal
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
        }}
      />

      {/* Download Website ZIP Modal */}
      <DownloadZipModal
        isOpen={isDownloadZipModalOpen}
        onClose={() => setIsDownloadZipModalOpen(false)}
      />
    </div>
  );
}

export default App;
