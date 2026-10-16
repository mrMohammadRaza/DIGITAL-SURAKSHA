import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/apiClient.js';
import { FeedbackItem } from '@digital-suraksha/shared';
import { Users, Calendar, Printer, MessageSquare, Star, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { VoicePlayButton } from '../components/common/VoicePlayButton.js';

export const CommunityPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [name, setName] = useState('');
  const [villageOrCity, setVillageOrCity] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<'general' | 'content_clarity' | 'language_quality' | 'cep_session'>('cep_session');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await api.getFeedback();
        setFeedbackList(data);
      } catch (err) {
        console.error('Failed to load feedback:', err);
      }
    };

    loadFeedback();
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      alert('Please enter at least 5 characters in your feedback.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const created = await api.submitFeedback({
        name: name.trim() || undefined,
        villageOrCity: villageOrCity.trim() || undefined,
        rating,
        category,
        comment: comment.trim(),
        language,
      });

      setFeedbackList((prev) => [created, ...prev]);
      setComment('');
      setName('');
      setVillageOrCity('');
      setSubmitMessage('Thank you! Your feedback has been recorded successfully.');
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Module J • सामुदायिक सहभागिता परियोजना (CEP)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.community.pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.community.pageSubtitle}
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm shadow hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Checklist (प्रिंट चेकलिस्ट)</span>
            </button>

            <VoicePlayButton
              text={`${t.community.pageTitle}. ${t.community.pageSubtitle}`}
              label={t.voice.play}
            />
          </div>
        </div>

        {/* Section 1: Objectives */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.community.objectivesTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.community.objectivesList.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {obj}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 45-Minute Village Workshop Schedule */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl sm:text-2xl">
            <Calendar className="w-6 h-6 text-emerald-500" />
            <h2>{t.community.workshopPlanTitle}</h2>
          </div>

          <div className="space-y-4">
            {t.community.workshopSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 gap-4"
              >
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    {step.time}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Printable Cyber Safety Pocket Checklist */}
        <div className="printable-card bg-emerald-50/70 dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/40 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {language === 'mr' ? 'गावकऱ्यांसाठी सायबर सुरक्षा पॉकेट चेकलिस्ट' : language === 'hi' ? 'ग्रामीण नागरिकों के लिए साइबर सुरक्षा पॉकेट चेकलिस्ट' : 'Rural Citizen Cyber Safety Pocket Checklist'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Cut and keep inside your diary or phone cover!
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hidden sm:flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-800 dark:text-slate-200">
            <div className="p-3 bg-white dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
              ✔️ <strong>पिन = पैसे भेजना:</strong> पैसे प्राप्त करने के लिए कभी पिन न डालें।
            </div>
            <div className="p-3 bg-white dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
              ✔️ <strong>गोपनीय OTP:</strong> बैंक मैनेजर या किसी को भी फोन पर OTP न बताएं।
            </div>
            <div className="p-3 bg-white dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
              ✔️ <strong>APK फाइलों से दूरी:</strong> व्हाट्सएप पर आई शादी कार्ड या योजना वाली APK न खोलें।
            </div>
            <div className="p-3 bg-white dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
              ✔️ <strong>आपातकालीन 1930:</strong> धोखाधड़ी होते ही तुरंत 1930 पर फोन करें।
            </div>
          </div>
        </div>

        {/* Section 4: Feedback Form */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl sm:text-2xl">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            <h2>{t.community.feedbackFormTitle}</h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.community.feedbackSubtitle}
          </p>

          {submitMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{submitMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {language === 'mr' ? 'नाव (ऐच्छिक)' : language === 'hi' ? 'नाम (वैकल्पिक)' : 'Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {language === 'mr' ? 'गाव / शहर' : language === 'hi' ? 'गाँव / शहर' : 'Village or City'}
                </label>
                <input
                  type="text"
                  value={villageOrCity}
                  onChange={(e) => setVillageOrCity(e.target.value)}
                  placeholder="e.g. Shirur Village"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="cep_session">Village Awareness Session (CEP)</option>
                  <option value="content_clarity">Content Clarity & Examples</option>
                  <option value="language_quality">Language & Voice Guidance</option>
                  <option value="general">General Suggestion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                {language === 'mr' ? 'तुमचा अभिप्राय' : language === 'hi' ? 'अपनी राय या सुझाव लिखें' : 'Your Observations & Feedback *'}
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience or how this helped villagers identify scams..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : t.common.submit}
            </button>
          </form>
        </div>

        {/* Section 5: Community Feedback Wall */}
        {feedbackList.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'mr' ? 'गावकऱ्यांचे प्रत्यक्ष अभिप्राय' : language === 'hi' ? 'समुदाय से प्राप्त वास्तविक प्रतिक्रियाएं' : 'Community Voices & Fieldwork Feedback'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.name || 'Anonymous Citizen'}
                      </h4>
                      <p className="text-xs text-slate-400">{item.villageOrCity}</p>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    "{item.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
