---
sidebar_position: 9
---

# 🤝 Contributing to WATA

This guide outlines how you can contribute to WATA and acknowledges the projects and individuals that have made it possible.

## Contributors

- [@ioiti](https://github.com/IOITI): Project author and maintainer
- [@hootnot](https://github.com/hootnot): [Saxo OpenAPI library](https://github.com/hootnot/saxo_openapi)

## How to Contribute

We welcome contributions to WATA! Here's how you can help:

1. **Report Issues**
   - Submit bugs or suggest features via [GitHub issues](https://github.com/IOITI/wata/issues)
   - Provide clear steps to reproduce problems
   - Include relevant logs or screenshots

2. **Submit Pull Requests**
   - Fork the repository
   - Create a feature branch for your changes
   - Write clean, well-documented code
   - Include tests where possible
   - Submit a pull request with a clear description of changes

3. **Share Feedback**
   - Let us know how you're using WATA
   - Suggest improvements to documentation
   - Propose new features or enhancements

## Development Environment

To set up a development environment:

1. Clone the repository
2. Install development dependencies
   ```bash
   pip install -r requirements-dev.txt
   ```
3. Run tests to ensure everything is working
   ```bash
   pytest
   ```

## Documentation Contributions

Documentation improvements are especially welcome:

1. Clone the repository
2. Make changes to the documentation files in `wata-docs/docs/`
3. Test changes locally by running:
   ```bash
   cd wata-docs
   npm install
   npm start
   ```
4. Submit a pull request with your changes

## Code Style

When contributing code, please follow these guidelines:

- Use Python type hints for function parameters and return values
- Write docstrings for functions and classes
- Follow PEP 8 standards
- Add unit tests for new functionality

## Acknowledgements

WATA would not be possible without these excellent projects and libraries:

- [@hootnot](https://github.com/hootnot): [Saxo OpenAPI library](https://github.com/hootnot/saxo_openapi)
- [Observable Framework](https://observablehq.com/framework): Powers the reporting dashboard
- [DuckDB](https://duckdb.org/): Provides the analytical database capabilities
- [FastAPI](https://fastapi.tiangolo.com/): Used for the webhook server
- [RabbitMQ](https://www.rabbitmq.com/): Handles messaging between components
- [Ansible](https://www.ansible.com/): Automates deployment

## License

WATA is licensed under the MIT License:

```
MIT License

Copyright (c) 2025 IOITI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
``` 