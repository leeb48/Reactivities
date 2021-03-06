using System;
using System.Reflection;
using Application.Activities;
using Application.Interfaces;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
         IConfiguration config)
        {

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });

            // Allow DataContext to be injected to other classes. DataContext is used to
            // query and save entities in the DB.
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            // Create a new CORS policy
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3000");
                });
            });

            // GetAssemblies includes all the handler assemblies
            var handlerAssembly = AppDomain.CurrentDomain.Load("Application");
            services.AddMediatR(handlerAssembly);
            // services.AddMediatR(AppDomain.CurrentDomain.GetAssemblies());

            // Add automapper
            services.AddAutoMapper(typeof(Application.Core.MappingProfiles).Assembly);

            // This service is scoped to per http request
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();

            // Use CloudinarySettings class to access settings set in application.json
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));

            services.AddSignalR();

            return services;
        }
    }
}