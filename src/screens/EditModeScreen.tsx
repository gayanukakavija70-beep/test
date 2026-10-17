import React, { useState } from 'react';
import { useAuthData } from '../context/AuthDataContext';
import { useTheme } from '../context/ThemeContext';
import { Flashcard, LessonFolder } from '../types';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Folder,
  Layers,
  AlertTriangle,
  X,
  Check,
  Sparkles,
} from 'lucide-react';

interface EditModeScreenProps {
  folder: LessonFolder;
  lessonId: number;
  onBack: () => void;
}

export const EditModeScreen: React.FC<EditModeScreenProps> = ({
  folder,
  lessonId,
  onBack,
}) => {
  const { cards, createCard, updateCard, deleteCard, updateFolder, deleteFolder } = useAuthData();
  const { colorClasses } = useTheme();

  // Cards belonging to this folder
  const folderCards = cards.filter((c) => c.folderId === folder.id);

  // New Card Form state
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isSavingCard, setIsSavingCard] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Edit Existing Card state
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editQuestion, setEditQuestion] = useState<string>('');
  const [editAnswer, setEditAnswer] = useState<string>('');
  const [isUpdatingCard, setIsUpdatingCard] = useState<boolean>(false);

  // Folder Rename & Delete Modals
  const [isRenameOpen, setIsRenameOpen] = useState<boolean>(false);
  const [renameInput, setRenameInput] = useState<string>(folder.name);
  const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState<boolean>(false);

  // Card Delete confirmation modal
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);

  const handleSaveNewCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    try {
      setIsSavingCard(true);
      await createCard(lessonId, folder.id, question, answer);
      // Clear form for the next card immediately
      setQuestion('');
      setAnswer('');
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleStartEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
  };

  const handleSaveEditedCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !editQuestion.trim() || !editAnswer.trim()) return;

    try {
      setIsUpdatingCard(true);
      await updateCard(editingCard.id, editQuestion, editAnswer);
      setEditingCard(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingCard(false);
    }
  };

  const handleConfirmDeleteCard = async () => {
    if (!cardToDelete) return;
    try {
      await deleteCard(cardToDelete.id, folder.id);
      setCardToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameInput.trim()) return;
    try {
      await updateFolder(folder.id, renameInput);
      setIsRenameOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder(folder.id);
      setIsDeleteFolderOpen(false);
      onBack();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Folder Header & Management Toolbar */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_#000] rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]">
              <Folder className="w-6 h-6 fill-amber-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-comic px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-black uppercase">
                  EDIT MODE
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>කාඩ්පත් {folderCards.length} ක්</span>
                </span>
              </div>
              <h1 className="font-comic text-2xl sm:text-3xl text-white tracking-wide mt-0.5">
                {folder.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setRenameInput(folder.name);
                setIsRenameOpen(true);
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl manga-btn border-2 border-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Rename</span>
            </button>

            <button
              onClick={() => setIsDeleteFolderOpen(true)}
              className="px-3.5 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl manga-btn border-2 border-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW CARD CREATION FORM */}
      <div className="bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-5 sm:p-7 relative">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl ${colorClasses.bg} text-slate-950 border-2 border-black shadow-[2px_2px_0px_#000]`}>
              <Plus className="w-4 h-4 stroke-[3]" />
            </span>
            <h2 className="font-comic text-xl text-white">
              නව කාඩ්පතක් එක් කිරීම (Add Card)
            </h2>
          </div>

          {saveSuccessNotice && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500 px-2.5 py-1 rounded-full flex items-center gap-1 animate-bounce">
              <Check className="w-3.5 h-3.5" />
              <span>කාඩ්පත සාර්ථකව සුරැකිණි!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveNewCard} className="space-y-4">
          {/* Question Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>ප්‍රශ්නය (Question Box)</span>
              <span className="text-[11px] text-slate-400 lowercase">ඕනෑම භාෂාවකින් ලිවිය හැක</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={3}
              placeholder="කාඩ්පතේ ප්‍රශ්නය මෙහි සටහන් කරන්න... (උදා: ප්‍රභාසංස්ලේෂණයේ ආලෝක ප්‍රතික්‍රියාව සිදුවන්නේ කොහේද?)"
              className="w-full px-4 py-3 bg-slate-950 border-[3px] border-black rounded-2xl text-white placeholder-slate-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_#000] resize-y"
            />
          </div>

          {/* Answer Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>පිළිතුර (Answer Box)</span>
              <span className="text-[11px] text-slate-400 lowercase">Check ක්ලික් කළ පසු පෙනෙන පිළිතුර</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              rows={3}
              placeholder="පිළිතුර මෙහි සටහන් කරන්න... (උදා: හරිතලවයේ තයිලකොයිඩ පටල මත)"
              className="w-full px-4 py-3 bg-slate-950 border-[3px] border-black rounded-2xl text-white placeholder-slate-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_#000] resize-y"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSavingCard || !question.trim() || !answer.trim()}
              className={`px-6 py-3 rounded-2xl font-display font-bold text-base text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn flex items-center gap-2 cursor-pointer ${
                isSavingCard ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <Save className="w-5 h-5 stroke-[2.5]" />
              <span>{isSavingCard ? 'සුරැකෙමින්...' : 'Save (සුරකින්න)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* EXISTING CARDS IN THIS FOLDER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-comic text-lg sm:text-xl text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>මෙම ෆෝල්ඩරයේ ඇති කාඩ්පත් ({folderCards.length})</span>
          </h2>
        </div>

        {folderCards.length === 0 ? (
          <div className="bg-slate-900/60 border-2 border-dashed border-slate-700 rounded-3xl p-8 text-center text-slate-400 text-sm">
            තවම කාඩ්පත් එකතු කර නැත. ඉහත පෝරමය මඟින් ප්‍රශ්නයක් සහ පිළිතුරක් ඇතුළත් කර Save කරන්න.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {folderCards.map((card, idx) => (
              <div
                key={card.id}
                className="bg-slate-900 border-[3px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] relative space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-comic px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-black">
                      #{idx + 1}
                    </span>
                    {card.lastResult === 'correct' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500">
                        මතකයි (Correct)
                      </span>
                    )}
                    {card.lastResult === 'wrong' && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500">
                        අමතකයි (Wrong)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEditCard(card)}
                      aria-label="Edit Card"
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Card"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCardToDelete(card)}
                      aria-label="Delete Card"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-slate-950/80 border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Question (ප්‍රශ්නය)
                  </span>
                  <p className="text-white font-medium text-sm sm:text-base whitespace-pre-wrap">
                    {card.question}
                  </p>
                </div>

                {/* Answer */}
                <div className="bg-slate-950/50 border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Answer (පිළිතුර)
                  </span>
                  <p className="text-emerald-300 font-medium text-sm sm:text-base whitespace-pre-wrap">
                    {card.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: EDIT EXISTING CARD */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 relative">
            <button
              onClick={() => setEditingCard(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-comic text-xl text-white mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-cyan-400" />
              <span>කාඩ්පත සංස්කරණය කිරීම (Edit Card)</span>
            </h3>

            <form onSubmit={handleSaveEditedCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  ප්‍රශ්නය (Question)
                </label>
                <textarea
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-950 border-[3px] border-black rounded-2xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[2px_2px_0px_#000] resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  පිළිතුර (Answer)
                </label>
                <textarea
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-950 border-[3px] border-black rounded-2xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[2px_2px_0px_#000] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-xl border-2 border-black bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCard || !editQuestion.trim() || !editAnswer.trim()}
                  className={`px-5 py-2 rounded-xl font-bold text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn cursor-pointer`}
                >
                  {isUpdatingCard ? 'සුරැකෙමින්...' : 'Save (සුරකින්න)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CARD CONFIRMATION */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-400 flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-comic text-xl text-white">කාඩ්පත මකා දමන්නද?</h3>
            <p className="text-xs text-slate-300">
              මෙම කාඩ්පත ස්ථිරවම මකා දැමෙනු ඇත.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCardToDelete(null)}
                className="px-4 py-2 rounded-xl border-2 border-black bg-slate-800 text-slate-300 font-bold text-sm"
              >
                නැත
              </button>
              <button
                onClick={handleConfirmDeleteCard}
                className="px-4 py-2 rounded-xl border-2 border-black bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm manga-btn"
              >
                ඔව්, මකා දමන්න
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RENAME FOLDER */}
      {isRenameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 relative">
            <button
              onClick={() => setIsRenameOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-comic text-xl text-white mb-4">ෆෝල්ඩර නම වෙනස් කිරීම</h3>
            <form onSubmit={handleRenameFolder} className="space-y-4">
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                maxLength={100}
                required
                className="w-full px-4 py-3 bg-slate-950 border-[3px] border-black rounded-2xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_#000]"
                autoFocus
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRenameOpen(false)}
                  className="px-4 py-2 rounded-xl border-2 border-black bg-slate-800 text-slate-300 font-bold text-sm"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  disabled={!renameInput.trim()}
                  className={`px-5 py-2 rounded-xl font-bold text-sm text-slate-950 ${colorClasses.bg} ${colorClasses.bgHover} manga-btn`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE FOLDER CONFIRMATION */}
      {isDeleteFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-950 border-2 border-rose-500 text-rose-400 flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-comic text-2xl text-white">ෆෝල්ඩරය මකා දමන්නද?</h3>
            <p className="text-sm text-slate-300">
              "{folder.name}" ෆෝල්ඩරය සහ එහි අඩංගු සියලුම කාඩ්පත් ({folderCards.length}) ස්ථිරවම මකා දැමෙනු ඇත. මෙය නැවත ලබාගත නොහැක.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteFolderOpen(false)}
                className="px-5 py-2.5 rounded-xl border-2 border-black bg-slate-800 text-slate-300 font-bold text-sm"
              >
                අවලංගු කරන්න
              </button>
              <button
                onClick={handleDeleteFolder}
                className="px-5 py-2.5 rounded-xl border-2 border-black bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm manga-btn"
              >
                ඔව්, මකා දමන්න
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
