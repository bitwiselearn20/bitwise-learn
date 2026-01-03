import { createTopic } from "@/api/problems/create-topic";
import { updateDescription } from "@/api/problems/update-problem";
import MarkdownEditor from "@/component/ui/MarkDownEditor";
import { useParams } from "next/navigation";
import { useState } from "react";

type SubmissionsProps = {
  content: any;
};

function Submissions({ content }: SubmissionsProps) {
  if (!content) return null;
  const param = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(content.name);
  const [description, setDescription] = useState(content.description);
  const [difficulty, setDifficulty] = useState(content.difficulty);
  const [hints, setHints] = useState<string[]>(content.hints || []);
  const [topics, setTopics] = useState<string[]>(
    content.problemTopics?.[0]?.tagName || []
  );
  const [newTopic, setNewTopic] = useState("");

  /* ---------------- HELPERS ---------------- */
  const resetChanges = () => {
    setName(content.name);
    setDescription(content.description);
    setDifficulty(content.difficulty);
    setHints(content.hints || []);
    setTopics(content.problemTopics?.[0]?.tagName || []);
  };

  const updateHint = (index: number, value: string) => {
    const updated = [...hints];
    updated[index] = value;
    setHints(updated);
  };

  const addHint = () => setHints([...hints, ""]);
  const removeHint = (index: number) =>
    setHints(hints.filter((_, i) => i !== index));

  const addTopic = () => {
    if (!newTopic.trim() || topics.includes(newTopic.trim())) return;
    setTopics([...topics, newTopic.trim()]);
    setNewTopic("");
  };

  const removeTopic = (tag: string) =>
    setTopics(topics.filter((t) => t !== tag));

  const handleSave = async () => {
    setIsSaving(true);

    const updatedData = {
      name,
      description,
      difficulty,
      hints,
      problemTopics: [
        {
          ...content.problemTopics?.[0],
          tagName: topics,
        },
      ],
    };

    console.log("Saved Data:", updatedData);
    await updateDescription(content.id as string, updatedData);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            className="text-3xl font-bold bg-transparent border-b border-gray-600 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <h1 className="text-3xl font-bold">{name}</h1>
        )}

        <div className="flex gap-3 items-center">
          {isEditing ? (
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-gray-800 px-3 py-1 rounded-md"
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          ) : (
            <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              {difficulty}
            </span>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 px-4 py-1 rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        {isEditing ? (
          <MarkdownEditor
            value={description}
            setValue={setDescription}
            mode={"edit"}
            hideToolbar={false}
          />
        ) : (
          //@ts-ignore
          <MarkdownEditor value={description} mode={"preview"} />
        )}
      </section>

      {/* Topics */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Topics</h2>

        {topics.length === 0 && (
          <div>
            <div className="flex gap-2">
              <input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add topic"
                className="bg-gray-800 px-3 py-1 rounded-md flex-1"
              />
              <button
                onClick={() =>
                  createTopic(param.id as string, { tagName: [newTopic] })
                }
                className="bg-blue-600 px-4 py-1 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-3">
          {topics.length > 0 &&
            topics.map((tag) => (
              <span
                key={tag}
                className="bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                {isEditing && (
                  <button
                    onClick={() => removeTopic(tag)}
                    className="text-red-400"
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
        </div>

        {isEditing && (
          <div className="flex gap-2">
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add topic"
              className="bg-gray-800 px-3 py-1 rounded-md flex-1"
            />
            <button
              onClick={addTopic}
              className="bg-blue-600 px-4 py-1 rounded-md"
            >
              Add
            </button>
          </div>
        )}
      </section>

      {/* Hints */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Hints</h2>

        {isEditing ? (
          <>
            {hints.map((hint, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  className="flex-1 bg-gray-900 p-2 rounded-md"
                />
                <button
                  onClick={() => removeHint(index)}
                  className="text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}

            <button onClick={addHint} className="text-blue-400 hover:underline">
              + Add Hint
            </button>
          </>
        ) : (
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {hints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Footer */}
      <footer className="pt-4 border-t border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <p>Created: {new Date(content.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(content.updatedAt).toLocaleString()}</p>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetChanges();
                setIsEditing(false);
              }}
              className="bg-gray-600 px-4 py-2 rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 px-6 py-2 rounded-md font-semibold"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}

export default Submissions;
