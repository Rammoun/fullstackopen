const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()      
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('Password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      
      const errorDiv = page.getByText('Wrong credentials, login failed')
      await expect(errorDiv).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create New Blog' }).click()
      await page.getByLabel('Title:').fill('Playwright is awesome')
      await page.getByLabel('Author:').fill('Microsoft')
      await page.getByLabel('Url:').fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Blog Playwright is awesome added')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        
        await page.getByRole('button', { name: 'Create New Blog' }).click()
        await page.getByLabel('Title:').fill('Playwright likes me')
        await page.getByLabel('Author:').fill('Me')
        await page.getByLabel('Url:').fill('https://likes.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Blog Playwright likes me added').waitFor()
      })

      test('it can be liked', async ({ page }) => {
        const blogElement = page.locator('.blog').last();
        await blogElement.getByRole('button', { name: 'Show' }).click()        
        await expect(blogElement.getByText('Likes: 0')).toBeVisible()
        await blogElement.getByRole('button', { name: 'Like' }).click()
        await page.getByText('Blog Playwright likes me liked').waitFor()
      })
      test('the user who created a blog can delete it', async ({ page }) => {        
        const blogElement = page.locator('.blog').last();
        await blogElement.getByRole('button', { name: 'Show' }).click()
        page.on('dialog', dialog => dialog.accept());
        await blogElement.getByText('Remove').click();
        await expect(blogElement).not.toBeVisible();
      })
      test('only the creator can see the delete button', async ({ page, request }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Other User',
            username: 'otheruser',
            password: 'passwordxxx'
          }
        })
        await page.getByLabel('username').fill('otheruser')
        await page.getByLabel('Password').fill('passwordxxx')
        await page.getByRole('button', { name: 'login' }).click()
        const blogElement = page.locator('.blog').last()
        await blogElement.getByRole('button', { name: 'Show' }).click()
        await expect(blogElement.getByText('Remove')).not.toBeVisible()
      })
      test('blogs are arranged in the order of likes', async ({ page }) => {
        await page.getByRole('button', { name: 'Create New Blog' }).click()
        await page.getByLabel('Title:').fill('Most Likes Blog')
        await page.getByLabel('Author:').fill('Me')
        await page.getByLabel('Url:').fill('http://likes.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Blog Most Likes Blog added').waitFor()
        await page.getByRole('button', { name: 'Create New Blog' }).click()
        await page.getByLabel('Title:').fill('Second Best Blog')
        await page.getByLabel('Author:').fill('Me')
        await page.getByLabel('Url:').fill('http://likes.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Blog Second Best Blog added').waitFor()        
        await page.getByRole('button', { name: 'Create New Blog' }).click()
        await page.getByLabel('Title:').fill('No Likes Blog')
        await page.getByLabel('Author:').fill('Me')
        await page.getByLabel('Url:').fill('http://likes.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Blog No Likes Blog added').waitFor()
        
        const mostLikesBlog = page.locator('.blog').filter({ hasText: 'Most Likes Blog' })
        await mostLikesBlog.getByRole('button', { name: 'Show' }).click()
        const likeButton1 = mostLikesBlog.getByRole('button', { name: 'Like' })
        await likeButton1.click()
        await expect(mostLikesBlog.getByText('Likes: 1')).toBeVisible() 
        await likeButton1.click()
        await expect(mostLikesBlog.getByText('Likes: 2')).toBeVisible() 
        const secondBestBlog = page.locator('.blog').filter({ hasText: 'Second Best Blog' })
        await secondBestBlog.getByRole('button', { name: 'Show' }).click()
        const likeButton2 = secondBestBlog.getByRole('button', { name: 'Like' })
        await likeButton2.click()
        await expect(secondBestBlog.getByText('Likes: 1')).toBeVisible()
        const blogs = page.locator('.blog')
        await expect(blogs.first()).toContainText('Most Likes Blog')
        await expect(blogs.nth(1)).toContainText('Second Best Blog')
        await expect(blogs.last()).toContainText('No Likes Blog')
      })
    })
  })
})

