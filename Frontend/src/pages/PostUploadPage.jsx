import { useState, useRef } from "react"
import { PostService } from "../services/PostService"

export default function PostUpload() {
  const [postText, setPostText] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    addFiles(files)
  }

  const addFiles = (files) => {
    const validFiles = []
    let hasError = false

    files.forEach(file => {
      const validation = PostService.validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target.result,
            type: file.type.startsWith('video/') ? 'video' : 'image'
          }
          setFilePreviews(prev => [...prev, preview])
        }
        reader.readAsDataURL(file)
      } else {
        setError(validation.message)
        hasError = true
      }
    })

    if (!hasError) {
      setSelectedFiles(prev => [...prev, ...validFiles])
      setError("")
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const handlePost = async () => {
    if (!postText.trim() && selectedFiles.length === 0) return

    setIsPosting(true)
    setError("")

    try {
      console.log('Bắt đầu tạo bài viết với', selectedFiles.length, 'file(s)')
      
      const postData = {
        content: postText,
        media: selectedFiles
      }

      const result = await PostService.createPost(postData)

      if (result.success) {
        // Reset form
        setPostText("")
        setSelectedFiles([])
        setFilePreviews([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        alert("Đăng bài thành công!")
        
        window.location.href = '/'
      } else {
        console.error("Lỗi tạo bài viết:", result.message)
        setError(result.message || "Có lỗi xảy ra khi đăng bài")
      }
    } catch (error) {
      console.error("Post creation error:", error)
      setError("Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.")
    } finally {
      setIsPosting(false)
    }
  }

  const removeFile = (fileId) => {
    setFilePreviews(prev => prev.filter(preview => preview.id !== fileId))
    setSelectedFiles(prev => {
      const updatedFiles = [...prev]
      const previewIndex = filePreviews.findIndex(p => p.id === fileId)
      if (previewIndex !== -1) {
        updatedFiles.splice(previewIndex, 1)
      }
      return updatedFiles
    })
    
    if (selectedFiles.length === 1) {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 p-4 pb-32">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-border/50 shadow-lg">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-foreground">TẠO BÀI VIẾT</h1>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Main Post Creation Area */}
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-lg space-y-6 mb-32">
          {/* Text Input */}
          <div className="relative">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full h-32 p-4 bg-input/50 backdrop-blur-sm border border-border rounded-xl resize-none text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">{postText.length}/500</div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            {filePreviews.length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Kéo hoặc thả file vào đây</p>
                    <p className="text-muted-foreground text-sm">hoặc nhấp để duyệt (tối đa 5 file)</p>
                    <p className="text-muted-foreground text-xs mt-1">Hỗ trợ: JPG, PNG, GIF, MP4, MOV, AVI (tối đa 50MB/file)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filePreviews.map((preview) => (
                    <div key={preview.id} className="relative rounded-xl overflow-hidden">
                      {preview.type === 'video' ? (
                        <video src={preview.url} className="w-full h-48 object-cover" controls />
                      ) : (
                        <img src={preview.url} alt="Preview" className="w-full h-48 object-cover" />
                      )}
                      <button
                        onClick={() => removeFile(preview.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 backdrop-blur-sm rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Add more files button */}
                {filePreviews.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-2 border-purple-300 hover:border-purple-400 rounded-xl p-4 text-center transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    <span className="text-purple-600 font-medium">+ Thêm file khác ({filePreviews.length}/5)</span>
                  </button>
                )}
              </div>
            )}
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleFileUpload} 
              multiple 
              className="hidden" 
            />
          </div>

          {/* Post Options */}
          <div className="flex items-center justify-end pt-4 border-t border-border/50">
            {/* Post Button */}
            <button
              onClick={handlePost}
              disabled={(!postText.trim() && selectedFiles.length === 0) || isPosting}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-muted disabled:text-muted-foreground text-white rounded-xl font-medium transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {isPosting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng bài...</span>
                </div>
              ) : (
                "Đăng bài"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
