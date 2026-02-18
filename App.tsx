import React, { useState, useEffect } from 'react';
import { AppView, User, SkinProfile, BodyProfile, WardrobeItem, FeedbackRecord } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Wardrobe from './components/Wardrobe';
import StylePlanner from './components/StylePlanner';
import Login from './components/Login';
import ProfileBuilder from './components/ProfileBuilder';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>(AppView.LOGIN);
  const [skin, setSkin] = useState<SkinProfile | null>(null);
  const [body, setBody] = useState<BodyProfile | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackRecord[]>([]);

  useEffect(() => {
    const savedWardrobe = localStorage.getItem('ss_wardrobe');
    if (savedWardrobe) setWardrobe(JSON.parse(savedWardrobe));
    
    const savedUser = localStorage.getItem('ss_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setActiveView(AppView.DASHBOARD);
      
      const savedSkin = localStorage.getItem('ss_skin');
      const savedBody = localStorage.getItem('ss_body');
      if (savedSkin) setSkin(JSON.parse(savedSkin));
      if (savedBody) setBody(JSON.parse(savedBody));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ss_user', JSON.stringify(u));
    if (skin && body) {
      setActiveView(AppView.DASHBOARD);
    } else {
      setActiveView(AppView.PROFILE);
    }
  };

  const handleProfileComplete = (s: SkinProfile, b: BodyProfile) => {
    setSkin(s);
    setBody(b);
    localStorage.setItem('ss_skin', JSON.stringify(s));
    localStorage.setItem('ss_body', JSON.stringify(b));
    setActiveView(AppView.DASHBOARD);
  };

  const handleAddItem = (item: WardrobeItem) => {
    const updated = [item, ...wardrobe];
    setWardrobe(updated);
    localStorage.setItem('ss_wardrobe', JSON.stringify(updated));
  };

  const handleFeedback = (f: FeedbackRecord) => {
    setFeedbackHistory(prev => [...prev, f]);
  };

  if (activeView === AppView.LOGIN) return <Login onLogin={handleLogin} />;
  if (activeView === AppView.PROFILE) return <ProfileBuilder onComplete={handleProfileComplete} />;

  const renderContent = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard wardrobe={wardrobe} onNavigate={setActiveView} />;
      case AppView.WARDROBE:
        return <Wardrobe items={wardrobe} onAddItem={handleAddItem} />;
      case AppView.PLANNER:
        if (!skin || !body) return null;
        return <StylePlanner wardrobe={wardrobe} skin={skin} body={body} onFeedback={handleFeedback} />;
      default:
        return <Dashboard wardrobe={wardrobe} onNavigate={setActiveView} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
