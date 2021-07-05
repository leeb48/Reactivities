using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Profiles
{
    public class UserActivityList
    {
        public class Query : IRequest<Result<PagedList<UserActivityDto>>>
        {
            public string Username { get; set; }
            public UserActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PagedList<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(x => x.Attendees.Any(a => a.AppUser.UserName == request.Username))
                    .OrderBy(a => a.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();


                query = request.Params.Predicate switch
                {
                    "past" => query.Where(x => x.Date < DateTime.UtcNow),
                    "future" => query.Where(x => x.Date >= DateTime.UtcNow),
                    "hosting" => query.Where(x => x.HostUsername == request.Username),
                    _ => query,
                };


                return Result<PagedList<UserActivityDto>>.Success(
                    await PagedList<UserActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}