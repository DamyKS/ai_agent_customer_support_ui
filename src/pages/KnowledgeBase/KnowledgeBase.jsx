"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, BookOpen, Tag, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { knowledgeBaseService } from "../../services/knowledgeBaseService"
import { formatTimeAgo } from "../../utils/dateUtils"

const categories = ["All", "technical", "billing", "general", "support", "account"]
const statusOptions = ["draft", "published", "archived"]

export function KnowledgeBase() {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingArticle, setViewingArticle] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    status: "published",
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await knowledgeBaseService.getArticles()
      if (result.success) {
        setArticles(result.data)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Failed to load articles")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateArticle = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const result = await knowledgeBaseService.createArticle(formData)
      if (result.success) {
        await fetchArticles() // Refresh the list
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        if (typeof result.error === "object") {
          const errorMessages = Object.entries(result.error)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("; ")
          setError(errorMessages)
        } else {
          setError(result.error)
        }
      }
    } catch (error) {
      setError("Failed to create article")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditArticle = async (e) => {
    e.preventDefault()
    if (!editingArticle) return

    setSubmitting(true)
    setError("")

    try {
      const result = await knowledgeBaseService.updateArticle(editingArticle.id, formData)
      if (result.success) {
        await fetchArticles() // Refresh the list
        setIsEditDialogOpen(false)
        setEditingArticle(null)
        resetForm()
      } else {
        if (typeof result.error === "object") {
          const errorMessages = Object.entries(result.error)
            .map(
              ([field, messages]) =>
                `${(field, messages)}\`) => \`${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`,
            )
            .join("; ")
          setError(errorMessages)
        } else {
          setError(result.error)
        }
      }
    } catch (error) {
      setError("Failed to update article")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteArticle = async (articleId) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const result = await knowledgeBaseService.deleteArticle(articleId)
      if (result.success) {
        await fetchArticles() // Refresh the list
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Failed to delete article")
    }
  }

  const openEditDialog = (article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags,
      status: article.status,
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (article) => {
    setViewingArticle(article)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: "",
      status: "published",
    })
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate stats
  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
    archived: articles.filter((a) => a.status === "archived").length,
    totalViews: articles.reduce((sum, article) => sum + article.views, 0),
    categories: [...new Set(articles.map((a) => a.category))].length,
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Manage articles and documentation for your support team and customers
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading articles...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage articles and documentation for your support team and customers</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
              <DialogDescription>Add a new article to your knowledge base</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateArticle}>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleFormChange("category", value)}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleFormChange("status", value)}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags (comma separated)"
                    value={formData.tags}
                    onChange={(e) => handleFormChange("tags", e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here..."
                    className="min-h-[200px]"
                    value={formData.content}
                    onChange={(e) => handleFormChange("content", e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Article"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !isCreateDialogOpen && !isEditDialogOpen && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.published} published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">Across all topics</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Articles ({filteredArticles.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{selectedCategory}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={fetchArticles}>
                <Loader2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedCategory !== "All" ? "No articles match your filters" : "No articles found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(article.status)} className={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.views.toLocaleString()}</TableCell>
                    <TableCell>{formatTimeAgo(article.updated_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {article.tags
                          .split(",")
                          .filter((tag) => tag.trim())
                          .slice(0, 2)
                          .map((tag) => (
                            <Badge key={tag.trim()} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        {article.tags.split(",").filter((tag) => tag.trim()).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.split(",").filter((tag) => tag.trim()).length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openViewDialog(article)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(article)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>Update the article information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditArticle}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter article title"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleFormChange("category", value)}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleFormChange("status", value)}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  placeholder="Enter tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => handleFormChange("tags", e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  placeholder="Write your article content here..."
                  className="min-h-[200px]"
                  value={formData.content}
                  onChange={(e) => handleFormChange("content", e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingArticle(null)
                  resetForm()
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Article"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {viewingArticle?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className={getStatusColor(viewingArticle?.status)}>
                  {viewingArticle?.status}
                </Badge>
                <Badge variant="outline">{viewingArticle?.category}</Badge>
                <span className="text-sm text-muted-foreground">{viewingArticle?.views} views</span>
                <span className="text-sm text-muted-foreground">
                  Last updated: {viewingArticle?.updated_at && formatTimeAgo(viewingArticle.updated_at)}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {viewingArticle && (
            <div className="space-y-4">
              {/* Tags */}
              {viewingArticle.tags && (
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {viewingArticle.tags
                      .split(",")
                      .filter((tag) => tag.trim())
                      .map((tag) => (
                        <Badge key={tag.trim()} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <Label className="text-sm font-medium">Content</Label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{viewingArticle.content}</div>
                  </div>
                </div>
              </div>

              {/* Article Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Article ID</Label>
                  <p className="text-sm">{viewingArticle.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="text-sm capitalize">{viewingArticle.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="text-sm capitalize">{viewingArticle.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Views</Label>
                  <p className="text-sm">{viewingArticle.views.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => openEditDialog(viewingArticle)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Article
            </Button>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
