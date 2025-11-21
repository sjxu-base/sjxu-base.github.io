---
title: "Python 语法糖解析：使用装饰器来包装函数"
date: 2021-06-22
excerpt: ""
categories: ["Language"]
tags: ["Python", "Decorator"]
---

# 0x01 Why：为什么需要装饰函数？

在于 Python 中函数是一等公民，函数也被理解为对象。

而为了增强函数的功能，支持更加复杂的对象使用方式。

装饰函数就可以用于 增强函数功能，提炼共有功能，避免冗余代码。

## Use Case：使用场景

计算程序运算时间，Flask中检验用户是否登录，例如利用装饰器计算函数时间。

```python
import time
def time_calc(func):
    def wrapper(*args,**kargs):
        start_time=time.time()
        f=func(*args,**kargs)
        exec_time=time.time()-start_time
        return f
    return wrapper

@time_calc
def add(a,b):
    return a+b
@time_calc
def sub(a,b):
    return a-b
```

## Syntax Forms：定义格式

```python
# Define a decorator without @ sign
func=decorator(func_name)
func=(decorator(args))(func_time)

# Use @ sign without parameter
@decorator
def func():
    pass

# Use @ sign with parameter
@decorator(args)
def func():
	pass

# Use the decorated function directly
func()
```

为装饰器传入参数时，装饰器写法：三层函数定义装饰器

```python
def login(text):
	def decorator(func):
		def wrapper(*args,**kargs):
			print(text)
		return func(*args,**kargs)
	return decorator

@login('args of decorator is added')
def f():
    print('basic func')
```

## Python 语言的内置装饰器

### 支持属性获取的 @property 装饰器

用于定义`getter`和`setter`相关对，使class中的函数可以被当作类的一个attibuter来使用，使用时可以获取函数返回值。

```python
class Geek:
    _name = 'Sitong'

    @property
    def name(self):
        print("Getter Called")
        return self._name
    
    @name.setter
    def name(self,name):
        print("Setter Called")
        self._name = name

p = Geek()
print(p.name)

p.name = 'Sitong'
print(p.name)
```

### 定义静态函数的 @staticmethod 装饰器

用于定义类中的`static method`，不需要传入`self`和`cls`参数，可以直接使用。在不需要用到与类相关的属性和方法时，就可以用静态方法。

> The @staticmethod decorator is used to indicate that this is a static method. Unlike class methods, static methods do not have a special first parameter that refers to the class itself. Static methods are often used for utility functions that do not depend on the class or the instance of the class.

### 定义类功能的 @classmethod 装饰四起

用于定义`class method`，不与任何instance绑定，而与class本身绑定。所以不需要传入`self`参数，但是第一个参数设置为`cls`。

**可以用于与class相关的属性或方法，但这些方法是整个类通用的，而不是对象特异的**。

> The @classmethod decorator is used to indicate that this is a class method. The cls parameter in the method definition refers to the class itself, through which the class-level variables (example: class_val) and methods can be accessed. 

## 拆装：如何在被装饰函数中调用原函数的属性？

在使用 wrapper 函数编写装饰器后，被包装后的函数所有的 `__doc__` 和 `__name__` 等属性会被包装函数的 `__doc__` 和 `__name__` 覆盖。

此时原有函数的属性就无法被访问。

而编写装饰器时，对 wrapper 函数使用 wraps 装饰器即可恢复原有函数的属性，例如：

```python
from functools import wraps

def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """doc of wrapper"""
        print('123')
        return func(*args, **kwargs)

    return wrapper

@decorator
def say_hello():
    """doc of say hello"""
    print('Hi, mates')

# Output "say_hello"
print(say_hello.__name__)

# Output "doc of say hello"
print(say_hello.__doc__)
```

---

## Reference

- [PEP-318 Decorators for Functions and Methods Version](https://peps.python.org/pep-0318/)
- [Top 10 Python Built-In Decorators That Optimize Python Code Significantl](https://www.geeksforgeeks.org/top-python-built-in-decorators-that-optimize-python-code-significantly/)
