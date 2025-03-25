namespace TodoList.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

            if (descriptor != null)
            {
                services.Remove(
                    services.SingleOrDefault(d =>
                        d.ServiceType == typeof(IDbContextOptionsConfiguration<AppDbContext>))!
                );
            }

            services.AddDbContext<AppDbContext>(options => { options.UseInMemoryDatabase("InMemoryTestDatabase"); });

            var sp = services.BuildServiceProvider();

            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<AppDbContext>();

                db.Database.EnsureCreated();
            }
        });

        return base.CreateHost(builder);
    }
}