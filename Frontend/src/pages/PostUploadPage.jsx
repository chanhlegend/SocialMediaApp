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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 p-2 sm:p-4 pb-20 sm:pb-24 md:pb-32">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-border/50 shadow-lg">
          <div className="flex items-center justify-center">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">TẠO BÀI VIẾT</h1>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Main Post Creation Area */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50 shadow-lg space-y-4 sm:space-y-6 mb-20 sm:mb-24 md:mb-32">
          {/* Text Input với nút xóa */}
          <div className="relative">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full h-24 sm:h-32 p-3 sm:p-4 bg-input/50 backdrop-blur-sm border border-border rounded-xl resize-none text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm sm:text-base pr-10"
              maxLength={500}
            />
            {postText && (
              <button
                onClick={() => setPostText("")}
                className="absolute top-3 right-3 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                title="Xóa văn bản"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-muted-foreground">{postText.length}/500</div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            {filePreviews.length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 rounded-xl p-4 sm:p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm sm:text-base">Kéo hoặc thả file vào đây</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">hoặc nhấp để duyệt (tối đa 5 file)</p>
                    <p className="text-muted-foreground text-xs mt-1">Hỗ trợ: JPG, PNG, GIF, MP4, MOV, AVI (tối đa 50MB/file)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {filePreviews.map((preview) => (
                    <div key={preview.id} className="relative rounded-xl overflow-hidden group">
                      {preview.type === 'video' ? (
                        <video src={preview.url} className="w-full h-36 sm:h-48 object-cover" controls />
                      ) : (
                        <img src={preview.url} alt="Preview" className="w-full h-36 sm:h-48 object-cover" />
                      )}
                      {/* Nút xóa file với hiệu ứng hover */}
                      <button
                        onClick={() => removeFile(preview.id)}
                        className="absolute top-2 right-2 flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-500/50 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-2 border-purple-300 hover:border-red-400 rounded-xl text-red-500 hover:text-red-600 font-medium text-xs sm:text-sm transition-all transform hover:scale-[1.05] shadow-md z-10"
                        title="Xóa file"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add more files button */}
                {filePreviews.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-purple-500/50 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-2 border-purple-300 hover:border-purple-400 rounded-xl p-3 sm:p-4 text-center transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    <span className="text-purple-600 font-medium text-sm sm:text-base">+ Thêm file khác ({filePreviews.length}/5)</span>
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
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/50">
            {/* Hiển thị số lượng file đã chọn */}
            <div className="text-sm text-muted-foreground">
              {filePreviews.length > 0 && `${filePreviews.length} file đã chọn`}
            </div>

            {/* Post Button */}
            <button
              onClick={handlePost}
              disabled={(!postText.trim() && selectedFiles.length === 0) || isPosting}
              className="px-4 sm:px-6 py-2 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-muted disabled:text-muted-foreground text-white rounded-xl font-medium transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
            >
              {isPosting ? (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Đang đăng bài...</span>
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