module.exports = function(grunt) {

    // Grunt configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        fileName: 'extractor',
        pathBuild: 'build',
        pathSrc: 'src',

        banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
            ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.copyright %>\n' +
            ' */\n',

        clean: {
            build: ['<%= pathBuild %>/_*.js']
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            dev: {
                files: {
                    src: '<%= pathSrc %>/<%= fileName %>.js'
                }
            }
        },

        jasmine: {
            dev: {
                src: ['<%= pathPublic %>/scripts/app/**/*.js', '!<%= pathPublic %>/scripts/app/main.js'],
                options: {
                    // '--remote-debugger-port': 9000,
                    keepRunner: true,
                    vendor: '<%= pathPublic %>/scripts/libs/jquery/jquery.js',
                    helpers: 'test/jasmine/helpers/**/*.js',
                    specs: 'test/jasmine/spec/**/*.spec.js',
                    junit: {
                        path: 'test-reports'
                    }
                }
            }
        },

        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'version',
                            replacement: '<%= pkg.version %>'
                        },
                        {
                            match: /\/\*\s*@inject\s+extractor\.js\s*\*\//,
                            replacement: grunt.file.read('src/extractor.js'),
                            expression: true
                        }
                    ]
                },
                files: [
                    {src: ['<%= pathSrc %>/wrapper.js'], dest: '<%= pathBuild %>/_<%= fileName %>.js'}
                ]
            }
        },

        uglify: {
            dev: {
                options: {
                    beautify: true,
                    mangle: false,
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= pathBuild %>/<%= fileName %>.js': ['<%= pathBuild %>/_<%= fileName %>.js']
                }
            },
            build: {
                options: {
                    report: 'gzip',
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= pathBuild %>/<%= fileName %>.min.js': ['<%= pathBuild %>/_<%= fileName %>.js']
                }
            }
        }

    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');

    // Register task(s).
    grunt.registerTask('build', 'Build script.', ['test-dev', 'wrap', 'uglify', 'clean']);
    grunt.registerTask('default', 'Default task.', ['wrap']);
    grunt.registerTask('test-dev', 'Run dev tests.', ['jshint']);
    grunt.registerTask('wrap', 'Wrap file.', ['clean', 'replace']);
};
